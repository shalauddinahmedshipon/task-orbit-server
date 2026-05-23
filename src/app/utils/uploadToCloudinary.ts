import cloudinary from '../config/cloudinary.config';
import streamifier from 'streamifier';

export const sendImageToCloudinary = async (
  fileName: string,
  buffer: Buffer,
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'task-orbit-users',
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};