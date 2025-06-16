// utils/uploadToCloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: 'dreamroute_uploads',
    });
    // Remove file after upload
    fs.unlinkSync(localFilePath);
    return result.secure_url;
  } catch (err) {
    throw new Error('Upload to Cloudinary failed: ' + err.message);
  }
};
