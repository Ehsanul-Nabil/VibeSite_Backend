import mongoose from "mongoose";
import dns from "node:dns"; // Changed require to import

// Force Node.js to use public DNS servers to bypass Windows network SRV blocks
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to Database");
  } catch (err) {
    console.log("Database connection error:", err);
  }
};

export default connectToDB; 