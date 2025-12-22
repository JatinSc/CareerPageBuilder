import axios from 'axios';
import toast from 'react-hot-toast';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Uploads an image file to Cloudinary.
 * @param {File} file - The image file to upload.
 * @returns {Promise<string|null>} - The secure URL of the uploaded image or null if failed.
 */
export const uploadImage = async (file) => {
  if (!file) return null;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env");
    toast.error("Image upload configuration missing");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    toast.error("Failed to upload image");
    return null;
  }
};
