import mongoose from "mongoose";

const LoanSchema = new mongoose.Schema(
  {
    chama: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chama",
      required: true,
    },
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    guarantors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "paid", "defaulted", "overdue"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvalDate: {
      type: Date
    },
    repaymentSchedule: [{
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      dueDate: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "completed", "overdue"],
        default: "pending",
      },
      paymentDate: {
        type: Date
      },
      paymentMethod: {
        type: String,
        enum: ["cash", "mobile_money", "bank_transfer", "other"]
      },
      paymentReference: {
        type: String
      }
    }],
    collateral: {
      type: String,
      trim: true,
    },
    interestRate: {
      type: Number,
      min: 0,
      max: 100,
    },
    interestAmount: {
      type: Number,
      default: 0,
    },
    totalRepaymentAmount: {
      type: Number,
      default: 0,
    },
    paymentHistory: [{
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      paymentDate: {
        type: Date,
        required: true,
      },
      paymentMethod: {
        type: String,
        enum: ["cash", "mobile_money", "bank_transfer", "other"],
        required: true,
      },
      paymentReference: {
        type: String,
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
      },
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    closedAt: {
      type: Date
    },
    defaultDate: {
      type: Date
    },
    overdueSince: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
LoanSchema.virtual("totalPaid").get(function() {
  return this.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
});

LoanSchema.virtual("balance").get(function() {
  return this.totalRepaymentAmount - this.totalPaid;
});

LoanSchema.virtual("isOverdue").get(function() {
  if (this.status !== "approved") return false;
  
  const today = new Date();
  const nextPayment = this.repaymentSchedule.find(s => 
    s.status === "pending" && s.dueDate <= today
  );
  
  return !!nextPayment;
});

LoanSchema.virtual("daysOverdue").get(function() {
  if (!this.isOverdue) return 0;
  
  const nextPayment = this.repaymentSchedule.find(s => 
    s.status === "pending" && s.dueDate <= new Date()
  );
  
  return Math.floor((new Date() - nextPayment.dueDate) / (1000 * 60 * 60 * 24));
});

// Indexes
LoanSchema.index({ chama: 1, createdAt: -1 });
LoanSchema.index({ borrower: 1, createdAt: -1 });
LoanSchema.index({ status: 1 });
LoanSchema.index({ "repaymentSchedule.dueDate": 1 });
LoanSchema.index({ "repaymentSchedule.status": 1 });
LoanSchema.index({ "guarantors": 1 });

// Methods
LoanSchema.methods.calculateInterest = function() {
  if (!this.interestRate) return 0;
  
};

LoanSchema.methods.markAsPaid = function(payment) {
  // Record payment and update loan status
  this.payments = this.payments || [];
  this.payments.push({
    amount: payment.amount,
    date: payment.date || new Date(),
    recordedBy: payment.recordedBy,
    reference: payment.reference,
    notes: payment.notes,
    status: 'completed'
  });
  
  this.amountPaid = this.payments.reduce((sum, p) => sum + p.amount, 0);
  
  // Update repayment schedule if exists
  if (this.repaymentSchedule && this.repaymentSchedule.length > 0) {
    let remainingPayment = payment.amount;
    
    this.repaymentSchedule = this.repaymentSchedule
      .sort((a, b) => a.dueDate - b.dueDate)
      .map(installment => {
        if (remainingPayment <= 0) return installment;
        
        if (installment.status !== 'paid') {
          const remainingInstallment = installment.amount - (installment.amountPaid || 0);
          const paymentForThisInstallment = Math.min(remainingPayment, remainingInstallment);
          
          if (paymentForThisInstallment > 0) {
            installment.amountPaid = (installment.amountPaid || 0) + paymentForThisInstallment;
            remainingPayment -= paymentForThisInstallment;
            
            if (installment.amountPaid >= installment.amount) {
              installment.status = 'paid';
              installment.paymentDate = new Date();
            } else {
              installment.status = 'partially_paid';
            }
          }
        }
        
        return installment;
      });
  }
  
  // Update loan status
  if (this.amountPaid >= this.totalAmount) {
    this.status = 'paid';
    this.closedAt = new Date();
  } else if (this.dueDate && this.dueDate < new Date()) {
    this.status = 'overdue';
  } else if (this.status === 'pending' && this.approvedAt) {
    this.status = 'approved';
  }
  
  return this.save();
};

LoanSchema.methods.markAsDefaulted = function() {
  this.status = 'defaulted';
  return this.save();
};

LoanSchema.methods.calculateLateFee = function() {
  if (this.dueDate && this.dueDate < new Date() && this.lateFeeRate > 0) {
    const daysOverdue = Math.ceil((new Date() - this.dueDate) / (1000 * 60 * 60 * 24));
    this.lateFeeAmount = (this.amount * (this.lateFeeRate / 100) * daysOverdue) / 30; // Monthly rate
    return this.lateFeeAmount;
  }
  return 0;
};

// Update status to overdue for due loans
LoanSchema.statics.updateOverdueLoans = async function() {
  const now = new Date();
  const result = await this.updateMany(
    {
      status: { $in: ['approved', 'overdue'] },
      dueDate: { $lt: now },
      amountPaid: { $lt: this.totalAmount }
    },
    { $set: { status: 'overdue' } }
  );
  return result;
};

// Middleware to calculate total amount before saving
LoanSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('interestRate') || this.isModified('term')) {
    this.calculateInterest();
  }
  next();
});

export default mongoose.model("Loan", LoanSchema);
