require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Chama = require('./models/Chama');
const Contribution = require('./models/Contribution');
const Loan = require('./models/Loan');
const Meeting = require('./models/Meeting');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Migration functions
async function migrateUsers() {
    console.log('Migrating users...');
    const users = await User.find();
    for (const user of users) {
        // Add new fields with default values
        user.profilePicture = user.profilePicture || 'default-avatar.png';
        user.bio = user.bio || '';
        user.preferredCurrency = user.preferredCurrency || 'KSH';
        user.notificationPreferences = user.notificationPreferences || {
            email: true,
            sms: true,
            push: true
        };
        user.lastActivity = user.lastActivity || new Date();
        
        // Save updated user
        await user.save();
    }
    console.log('Users migration completed!');
}

async function migrateChamas() {
    console.log('Migrating chamas...');
    const chamas = await Chama.find();
    for (const chama of chamas) {
        // Update member objects to include new fields
        for (const member of chama.members) {
            member.isActive = member.isActive || true;
        }
        
        // Save updated chama
        await chama.save();
    }
    console.log('Chamas migration completed!');
}

async function migrateContributions() {
    console.log('Migrating contributions...');
    const contributions = await Contribution.find();
    for (const contribution of contributions) {
        // Add new fields with default values
        contribution.transactionId = contribution.transactionId || `TXN_${Math.random().toString(36).substr(2, 9)}`;
        contribution.verificationStatus = contribution.verificationStatus || 'pending';
        contribution.verificationNotes = contribution.verificationNotes || '';
        
        // Save updated contribution
        await contribution.save();
    }
    console.log('Contributions migration completed!');
}

async function migrateLoans() {
    console.log('Migrating loans...');
    const loans = await Loan.find();
    for (const loan of loans) {
        // Add new fields with default values
        loan.guarantors = loan.guarantors || [];
        loan.approvalDate = loan.approvalDate || null;
        loan.interestRate = loan.interestRate || 0;
        loan.interestAmount = loan.interestAmount || 0;
        loan.totalRepaymentAmount = loan.totalRepaymentAmount || loan.amount;
        loan.paymentHistory = loan.paymentHistory || [];
        loan.closedAt = loan.closedAt || null;
        loan.defaultDate = loan.defaultDate || null;
        loan.overdueSince = loan.overdueSince || null;
        
        // Calculate interest if needed
        if (loan.interestRate > 0) {
            const monthlyRate = loan.interestRate / 12 / 100;
            const totalInterest = loan.amount * monthlyRate * loan.repaymentSchedule.length;
            loan.interestAmount = totalInterest;
            loan.totalRepaymentAmount = loan.amount + totalInterest;
            
            // Update each repayment installment
            const installmentAmount = loan.totalRepaymentAmount / loan.repaymentSchedule.length;
            loan.repaymentSchedule.forEach(installment => {
                installment.amount = installmentAmount;
            });
        }
        
        // Save updated loan
        await loan.save();
    }
    console.log('Loans migration completed!');
}

async function migrateMeetings() {
    console.log('Migrating meetings...');
    const meetings = await Meeting.find();
    for (const meeting of meetings) {
        // Add new fields with default values
        meeting.recordedBy = meeting.recordedBy || null;
        meeting.attachments = meeting.attachments || [];
        meeting.meetingLink = meeting.meetingLink || '';
        meeting.isVirtual = meeting.isVirtual || false;
        meeting.virtualPlatform = meeting.virtualPlatform || 'Other';
        
        // Update agenda items to include new fields
        for (const item of meeting.agenda) {
            item.status = item.status || 'pending';
            item.notes = item.notes || '';
        }
        
        // Update attendees to include new fields
        for (const attendee of meeting.attendees) {
            attendee.arrivalTime = attendee.arrivalTime || null;
        }
        
        // Save updated meeting
        await meeting.save();
    }
    console.log('Meetings migration completed!');
}

// Run migrations
async function runMigrations() {
    try {
        console.log('Starting database migrations...');
        await migrateUsers();
        await migrateChamas();
        await migrateContributions();
        await migrateLoans();
        await migrateMeetings();
        console.log('All migrations completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Run the migrations
runMigrations();
