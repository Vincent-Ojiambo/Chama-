import 'dotenv/config';
import mongoose from 'mongoose';
import seedDatabase from './seed-data.js';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://Vincent:Vincent@cluster0.poind9k.mongodb.net/chamaplus", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 45000,
    family: 4
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedDatabase();
  })
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });

// Sample data
const sampleUsers = [
  {
    name: 'Vincent Ojiambo',
    email: 'vincent@example.com',
    password: '$2b$10$yourhashedpassword', // You should hash this password
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$yourhashedpassword',
    role: 'member',
  },
];

const sampleChamas = [
  {
    name: 'Mwanzo Chama',
    description: 'Our first chama group',
    members: [sampleUsers[0]._id, sampleUsers[1]._id],
    createdBy: sampleUsers[0]._id,
  },
  {
    name: 'Ujenzi Chama',
    description: 'Building our future',
    members: [sampleUsers[0]._id],
    createdBy: sampleUsers[0]._id,
  },
];

export { default as seedDatabase } from './seed-data.js';
