import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY
    });

    cloudinary.api.ping()  // Kiểm tra kết nối với Cloudinary
      .then(response => {
        console.log('Cloudinary connected and ping successful:', response);
      })
      .catch(err => {
        console.error('Error pinging Cloudinary:', err);
      });

    console.log('Connected to Cloudinary successfully');
  } catch (error) {
    console.error('Error connecting to Cloudinary:', error);
  }
};

export default connectCloudinary;
