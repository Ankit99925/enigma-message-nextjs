import mongoose from "mongoose";

type connectionState = {
  isConnected?: number;
}

const connection: connectionState = {}

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  // Add connection event handlers
  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    connection.isConnected = undefined;
  });

  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);

    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    // Don't exit the process, just throw the error
    throw error;
  }
}