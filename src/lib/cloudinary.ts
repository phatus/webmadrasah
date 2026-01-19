import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImage = async (url: string) => {
  try {
    if (!url) return;

    // Extract public_id from URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/my_image.jpg
    const regex = /\/upload\/(?:v\d+\/)?(.+?)\.[a-z]+$/;
    const match = url.match(regex);

    if (match && match[1]) {
        const publicId = match[1];
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted image: ${publicId}`);
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
};

export const deleteImages = async (urls: string[]) => {
    await Promise.all(urls.map(url => deleteImage(url)));
}
