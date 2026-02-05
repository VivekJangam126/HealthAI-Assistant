import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '', {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('\n⚠️  Please check:');
    console.error('   1. MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)');
    console.error('   2. Database username and password are correct');
    console.error('   3. Network connection is stable');
    console.error('   4. For local MongoDB, ensure mongod is running\n');
    console.error('   MongoDB Atlas Dashboard: https://cloud.mongodb.com\n');
    process.exit(1);
  }
};

export default connectDB;
