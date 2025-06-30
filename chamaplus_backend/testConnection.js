import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error("MongoDB connection string not found in environment variables");
      process.exit(1);
    }

    console.log("Testing MongoDB connection...");
    console.log("Using connection string:", MONGO_URI);

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
      retryWrites: true,
      w: 'majority',
      minPoolSize: 5,
      maxPoolSize: 50,
      waitQueueTimeoutMS: 30000,
      auth: {
        authSource: 'admin'
      }
    };

    await mongoose.connect(MONGO_URI, options);
    
    console.log("\nConnection successful!");
    console.log("Database name:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    console.log("Port:", mongoose.connection.port);
    console.log("\nConnection test completed successfully.");

    // Close the connection after testing
    await mongoose.connection.close();
    console.log("\nConnection closed.");

  } catch (err) {
    console.error("\nConnection test failed!");
    console.error("Error details:", err);
    console.error("\nPlease check:");
    console.error("1. Your MongoDB Atlas cluster is running");
    console.error("2. Your connection string is correct");
    console.error("3. Your network connection is stable");
    console.error("4. Your username and password are correct");
    console.error("5. Your IP address is whitelisted in MongoDB Atlas");
    process.exit(1);
  }
};

testConnection();
