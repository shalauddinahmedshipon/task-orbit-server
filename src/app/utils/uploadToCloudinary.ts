import cloudinary from '../config/cloudinary.config';
import streamifier from 'streamifier';

export const sendImageToCloudinary = async (
  fileName: string,
  buffer: Buffer,
  mimeType?: string, // 👈 add this parameter
) => {
  // Determine resource type based on mime type
  const getResourceType = (mime?: string): 'image' | 'video' | 'raw' | 'auto' => {
    if (!mime) return 'auto';
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    return 'raw'; // PDFs, docs, etc. → 'raw'
  };

  const resourceType = getResourceType(mimeType);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'task-orbit-users',
        public_id: fileName,
        resource_type: resourceType, // 👈 dynamic resource type
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