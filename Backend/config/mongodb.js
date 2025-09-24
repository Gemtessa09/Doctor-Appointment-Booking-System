import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/Clinic1`, {
      serverSelectionTimeoutMS: 30000 // 30 seconds
    });

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
