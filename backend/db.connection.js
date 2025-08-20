import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({});

const connectDB = async () => {
  try {
    const url = process.env.url;

    await mongoose.connect(url);

    console.log("DB connection established...");
  } catch (error) {
    console.log("DB connection failed...");
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
