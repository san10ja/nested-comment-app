import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoute.js";
import commentRoutes from "./routes/CommentRoute.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // React frontend URL
  credentials: true,               
}));

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);

app.listen(process.env.PORT , () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
