import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  disabled?: boolean;
  label?: string;
  description?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelected,
  accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.heic', '.webp', '.pdf'] },
  maxSize = 5 * 1024 * 1024,
  disabled = false,
  label = 'Upload receipt',
  description = 'Drag & drop or click to upload receipts. Max 5MB.',
}) => {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    acceptedFiles,
    fileRejections,
  } = useDropzone({
    accept,
    maxSize,
    multiple: false,
    disabled,
    onDropAccepted: (files) => {
      const [file] = files;
      if (file) {
        onFileSelected(file);
      }
    },
  });

  const rejectionMessage = useMemo(() => {
    if (fileRejections.length === 0) return '';
    const { errors } = fileRejections[0];
    if (!errors || errors.length === 0) return '';
    if (errors[0].code === 'file-too-large') {
      return File is too large. Max size is MB.;
    }
    return errors[0].message;
  }, [fileRejections, maxSize]);

  return (
    <div className="space-y-3">
      <div
        {...getRootProps({
          className: cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition theme-border  ,
        })}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-10 w-10 text-primary-500" />
        <p className="mt-3 text-sm font-semibold text-neutral-800">{label}</p>
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      </div>

      {acceptedFiles.length > 0 && (
        <div className="rounded-lg border border-primary-100 bg-primary-50/60 px-4 py-2 text-sm">
          Selected file: <strong>{acceptedFiles[0].name}</strong>
        </div>
      )}

      {rejectionMessage && <p className="text-sm text-error">{rejectionMessage}</p>}
    </div>
  );
};
