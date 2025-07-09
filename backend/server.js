import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
dotenv.config()


const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    app.listen(PORT,()=>{
          console.log(`Server running on http://localhost:${PORT}`)
    })
}).catch((error) => console.error('DB connection error:', error));