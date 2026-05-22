import multer from 'multer';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageCloudinary = (
  imageName: string,
  path: string,
  folder: string,
): Promise<Record<string, unknown>> => {
  return new Promise((resolve, rejects) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName, folder: `arkaxis/${folder}` },
      (error, result) => {
        fs.unlinkSync(path);
        if (error) {
          rejects(error);
        }
        resolve(result as UploadApiResponse);
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
});
export const Cloudinary = cloudinary;
