import mongoose from 'mongoose';
import User from '../models/User.js';
import Chama from '../models/Chama.js';
import Contribution from '../models/Contribution.js';
import Loan from '../models/Loan.js';
import Meeting from '../models/Meeting.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import Report from '../models/Report.js';
import Settings from '../models/Settings.js';

// Sample data
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'admin',
    phone: '+254712345678',
    address: 'Nairobi, Kenya',
    dateOfBirth: '1990-01-01',
    nationality: 'Kenyan',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'member',
    phone: '+254723456789',
    address: 'Nairobi, Kenya',
    dateOfBirth: '1991-01-01',
    nationality: 'Kenyan',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleChamas = [
  {
    name: 'Mwanzo Chama',
    description: 'First Chama Group',
    members: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        userId: null, // Will be set after users are created
        gender: 'male',
        village: 'Kilimani',
        subcounty: 'Kilimani',
        county: 'Nairobi',
        role: 'member',
        status: 'active',
        joinedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        userId: null, // Will be set after users are created
        gender: 'female',
        village: 'Kilimani',
        subcounty: 'Kilimani',
        county: 'Nairobi',
        role: 'member',
        status: 'active',
        joinedAt: new Date()
      }
    ],
    createdBy: null, // Will be set after users are created
    contributionAmount: 5000,
    meetingFrequency: 'monthly',
    loanInterestRate: 5,
    status: 'active',
    startDate: new Date(),
    rules: {
      minimumAge: 18,
      maximumAge: 60,
      requiredDocuments: ['ID', 'Passport', 'Bank Statement'],
      meetingDay: 'Sunday',
      meetingTime: '14:00',
      meetingLocation: 'Kilimani Community Hall'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Second Chama',
    description: 'Another Chama Group',
    members: [
      {
        name: 'John Doe',
        email: 'john@example.com',
        userId: null, // Will be set after users are created
        gender: 'male',
        village: 'Kilimani',
        subcounty: 'Kilimani',
        county: 'Nairobi',
        role: 'member',
        status: 'active',
        joinedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        userId: null, // Will be set after users are created
        gender: 'female',
        village: 'Kilimani',
        subcounty: 'Kilimani',
        county: 'Nairobi',
        role: 'member',
        status: 'active',
        joinedAt: new Date()
      }
    ],
    createdBy: null, // Will be set after users are created
    contributionAmount: 5000,
    meetingFrequency: 'monthly',
    loanInterestRate: 5,
    status: 'active',
    startDate: new Date(),
    rules: {
      minimumAge: 18,
      maximumAge: 60,
      requiredDocuments: ['ID', 'Passport', 'Bank Statement'],
      meetingDay: 'Sunday',
      meetingTime: '14:00',
      meetingLocation: 'Kilimani Community Hall'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleMeetings = [
  {
    chama: null,
    title: 'Monthly Chama Meeting',
    date: new Date(new Date().setDate(new Date().getDate() + 7)),
    time: '14:00',
    location: 'Kilimani Community Hall',
    agenda: [
      {
        topic: 'Monthly Contributions Review',
        duration: 30,
        responsible: {
          email: 'john@example.com'
        },
        status: 'pending'
      },
      {
        topic: 'Loan Applications Review',
        duration: 45,
        responsible: {
          email: 'john@example.com'
        },
        status: 'pending'
      }
    ],
    attendees: [
      {
        userId: {
          email: 'john@example.com'
        },
        name: 'John Doe',
        status: 'attending'
      },
      {
        userId: {
          email: 'jane@example.com'
        },
        name: 'Jane Smith',
        status: 'attending'
      }
    ]
  },
  {
    chama: null,
    title: 'Bi-Weekly Chama Meeting',
    date: new Date(new Date().setDate(new Date().getDate() + 14)),
    time: '10:00',
    location: 'Westlands Community Hall',
    agenda: [
      {
        topic: 'Financial Review',
        duration: 45,
        responsible: {
          email: 'john@example.com'
        },
        status: 'pending'
      },
      {
        topic: 'New Member Applications',
        duration: 30,
        responsible: {
          email: 'john@example.com'
        },
        status: 'pending'
      }
    ],
    attendees: [
      {
        userId: {
          email: 'john@example.com'
        },
        name: 'John Doe',
        status: 'attending'
      }
    ]
  }
];

export default async function seedDatabase() {
  try {
    // Clear existing data by dropping the database
    await mongoose.connection.dropDatabase();
    console.log('Database dropped successfully');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log('Users created successfully');

    // Update sample chamas with userIds
    const userMap = new Map();
    createdUsers.forEach(user => userMap.set(user.email, user._id));

    // Update chama members with userIds
    sampleChamas.forEach(chama => {
      chama.createdBy = createdUsers[0]._id;
      chama.members.forEach(member => {
        const user = createdUsers.find(u => u.email === member.email);
        if (user) {
          member.userId = user._id;
        }
      });
    });

    // Create chamas
    const createdChamas = await Chama.create(sampleChamas);
    console.log('Chamas created successfully');

    // Create contributions
    const contributions = await Contribution.insertMany([
      {
        chama: createdChamas[0]._id,
        user: createdUsers[0]._id,
        amount: 5000,
        status: 'completed',
        paymentMethod: 'bank_transfer',
        paymentReference: 'TX123456789',
        notes: 'Monthly contribution',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      },
      {
        chama: createdChamas[0]._id,
        user: createdUsers[1]._id,
        amount: 5000,
        status: 'pending',
        paymentMethod: 'mobile_money',
        paymentReference: 'TX987654321',
        notes: 'Monthly contribution pending',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      }
    ]);
    console.log('Contributions created successfully');

    // Create loans
    const loans = await Loan.insertMany([
      {
        chama: createdChamas[0]._id,
        borrower: createdUsers[1]._id,
        amount: 20000,
        interestRate: 5,
        duration: 6,
        status: 'approved',
        approvedBy: createdUsers[0]._id,
        approvalDate: new Date(),
        purpose: 'Business Expansion',
        repaymentSchedule: [
          {
            amount: 3733.33,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: 'pending'
          },
          {
            amount: 3733.33,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
            status: 'pending'
          },
          {
            amount: 3733.33,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
            status: 'pending'
          },
          {
            amount: 3733.33,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 4)),
            status: 'pending'
          },
          {
            amount: 3733.33,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 5)),
            status: 'pending'
          },
          {
            amount: 3733.33,
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            status: 'pending'
          }
        ],
        guarantors: [createdUsers[0]._id]
      }
    ]);
    console.log('Loans created successfully');

    // Create meetings
    const meetings = await Meeting.insertMany([
      {
        chama: createdChamas[0]._id,
        createdById: createdUsers[0]._id,
        title: 'Monthly Chama Meeting',
        date: new Date(new Date().setDate(new Date().getDate() + 7)),
        time: '14:00',
        location: 'Kilimani Community Hall',
        agenda: [
          {
            topic: 'Monthly Contributions Review',
            duration: 30,
            responsible: createdUsers[0]._id,
            status: 'pending'
          },
          {
            topic: 'Loan Applications Review',
            duration: 45,
            responsible: createdUsers[0]._id,
            status: 'pending'
          }
        ],
        attendees: [
          {
            userId: createdUsers[0]._id,
            name: createdUsers[0].name,
            status: 'attending'
          },
          {
            userId: createdUsers[1]._id,
            name: createdUsers[1].name,
            status: 'attending'
          }
        ]
      },
      {
        chama: createdChamas[1]._id,
        createdById: createdUsers[0]._id,
        title: 'Bi-Weekly Chama Meeting',
        date: new Date(new Date().setDate(new Date().getDate() + 14)),
        time: '10:00',
        location: 'Westlands Community Hall',
        agenda: [
          {
            topic: 'Financial Review',
            duration: 45,
            responsible: createdUsers[0]._id,
            status: 'pending'
          },
          {
            topic: 'New Member Applications',
            duration: 30,
            responsible: createdUsers[0]._id,
            status: 'pending'
          }
        ],
        attendees: [
          {
            userId: createdUsers[0]._id,
            name: createdUsers[0].name,
            status: 'attending'
          }
        ]
      }
    ]);
    console.log('Meetings created successfully');

    // Create notifications
    const notifications = await Notification.insertMany([
      {
        user: createdUsers[1]._id,
        type: 'contribution',
        title: 'Contribution Reminder',
        message: 'Your contribution of KES 5000 is due for this month',
        read: false,
        time: new Date()
      },
      {
        user: createdUsers[1]._id,
        type: 'loan',
        title: 'Loan Approved',
        message: 'Your loan request of KES 20000 has been approved',
        read: false,
        time: new Date()
      }
    ]);
    console.log('Notifications created successfully');

    // Create activity logs
    const activityLogs = await ActivityLog.insertMany([
      {
        user: createdUsers[0]._id,
        type: 'chama',
        action: 'created_chama',
        description: 'Created chama Mwanzo Chama',
        referenceId: createdChamas[0]._id,
        time: new Date()
      },
      {
        user: createdUsers[0]._id,
        type: 'loan',
        action: 'approved_loan',
        description: 'Approved loan request for John Doe',
        referenceId: loans[0]._id,
        time: new Date()
      }
    ]);
    console.log('Activity logs created successfully');

    // Create reports
    const reports = await Report.insertMany([
      {
        chama: createdChamas[0]._id,
        type: 'financial',
        period: 'monthly',
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
        data: {
          totalContributions: 10000,
          totalLoans: 20000,
          totalMembers: 2,
          monthlyContributions: [
            {
              userId: createdUsers[0]._id,
              amount: 5000,
              status: 'completed'
            },
            {
              userId: createdUsers[1]._id,
              amount: 5000,
              status: 'pending'
            }
          ],
          monthlyLoans: [
            {
              userId: createdUsers[1]._id,
              amount: 20000,
              status: 'approved'
            }
          ]
        },
        status: 'completed',
        generatedBy: createdUsers[0]._id,
        generatedAt: new Date()
      }
    ]);
    console.log('Reports created successfully');

    // Create user settings
    const settings = await Settings.insertMany([
      {
        user: createdUsers[0]._id,
        notifications: true,
        language: 'English',
        currency: 'KSH',
        timezone: 'Africa/Nairobi',
        darkMode: false,
        autoLogin: true,
        showTips: true,
        updateFrequency: 'weekly',
        theme: 'system',
        notificationSound: true,
        lastUpdated: new Date()
      },
      {
        user: createdUsers[1]._id,
        notifications: true,
        language: 'Swahili',
        currency: 'KSH',
        timezone: 'Africa/Nairobi',
        darkMode: false,
        autoLogin: true,
        showTips: true,
        updateFrequency: 'weekly',
        theme: 'system',
        notificationSound: true,
        lastUpdated: new Date()
      }
    ]);
    console.log('Settings created successfully');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}


