import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { uploadService } from '@services/upload.service';
import toast from 'react-hot-toast';

interface ReceiptUploadProps {
  onUploadComplete: (url: string, publicId: string) => void;
  currentReceiptUrl?: string;
  onRemove?: () => void;
  companyId: string;
  expenseId: string;
}

export const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
  onUploadComplete,
  currentReceiptUrl,
  onRemove,
  companyId,
  expenseId,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentReceiptUrl || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploading(true);
      const { url, publicId } = await uploadService.uploadReceipt(file, companyId, expenseId);
      onUploadComplete(url, publicId);
      toast.success('Receipt uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload receipt');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [companyId, expenseId, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const handleRemove = () => {
    setPreview(null);
    onRemove?.();
  };

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        <img
          src={preview}
          alt="Receipt preview"
          className="w-full h-64 object-cover rounded-lg border-2 border-neutral-200"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-2 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
        isDragActive
          ? 'border-primary-500 bg-primary-50'
          : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
      } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      
      {uploading ? (
        <div className="flex flex-col items-center space-y-2">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-sm text-neutral-600">Uploading receipt...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-12 h-12 text-neutral-400" />
          <p className="text-base font-medium text-neutral-700">
            {isDragActive ? 'Drop the receipt here' : 'Drag & drop receipt image'}
          </p>
          <p className="text-sm text-neutral-500">or click to browse (max 5MB)</p>
        </div>
      )}
    </div>
  );
};
