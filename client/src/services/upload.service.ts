import axios from 'axios';

export const uploadService = {
  /**
   * Upload file to Cloudinary
   */
  uploadToCloudinary: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'expense_management'); // You'll need to set this in Cloudinary
    formData.append('folder', 'expense_management/receipts');

    // Upload directly to Cloudinary
    const cloudinaryUrl = 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload'; // Replace with your cloud name
    
    const response = await axios.post(cloudinaryUrl, formData);
    return response.data.secure_url;
  },

  /**
   * Delete file from Cloudinary
   */
  deleteFromCloudinary: async (publicId: string): Promise<void> => {
    // This would typically be done through your backend
    // as it requires API secret
    await axios.post('/api/upload/delete', { publicId });
  },
};
