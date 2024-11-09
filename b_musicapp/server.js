import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routers/authRoutes.js';
import albumRoutes from './routers/albumRoutes.js'
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import songRoutes from './routers/songRoutes.js'



dotenv.config();
const app = express();
console.log('cloudinary config:', process.env.CLOUDINARY_API_KEY)

mongoose.connect('mongodb+srv://vndragon:thai900U@cluster0.ybccu.mongodb.net/musicapp2')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});


app.use(express.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// định nghĩa route 
app.use('/api/auth', authRoutes);
app.use('/api/album', albumRoutes);
app.use('/api/song', songRoutes);


app.listen(8080, () => {
    console.log('Server is running!');
});

