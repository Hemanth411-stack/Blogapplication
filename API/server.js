import express from 'express';
import dotenv from "dotenv";
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import BlogsRoute from "./Routes/BlogsRoute.js";
import cors from 'cors'; 

dotenv.config();

connectDB();


const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use("/api/blogs",BlogsRoute);

// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${PORT} mode on port ${PORT}`);
});