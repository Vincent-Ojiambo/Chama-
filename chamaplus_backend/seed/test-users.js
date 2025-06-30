import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@chamaplus.com',
    password: 'Admin@chamaplus', // Will be hashed by the pre-save hook
    role: 'admin',
    phone: '+254700000001',
    address: 'Nairobi, Kenya',
    dateOfBirth: '1990-01-01',
    nationality: 'Kenyan'
  },
  {
    name: 'Member User',
    email: 'member@chamaplus.com',
    password: 'Member@123', // Will be hashed by the pre-save hook
    role: 'member',
    phone: '+254700000002',
    address: 'Nairobi, Kenya',
    dateOfBirth: '1992-05-15',
    nationality: 'Kenyan'
  }
];

const seedTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing test users
    await User.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });

    // Create test users
    const createdUsers = await User.insertMany(testUsers);

    console.log('Test users seeded successfully:');
    console.log(createdUsers.map(user => ({
      name: user.name,
      email: user.email,
      role: user.role,
      _id: user._id
    })));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding test users:', error);
    process.exit(1);
  }
};

// Run the seeder
seedTestUsers();
