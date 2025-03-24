import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageUpload: (files: File[]) => void;
  isBulkProcessing: boolean;
}

export function ImageUpload({ onImageUpload, isBulkProcessing }: ImageUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: true
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        <div className="p-4 bg-blue-50 rounded-full">
          <ImageIcon className="h-12 w-12 text-blue-500" />
        </div>
        <Upload className="mt-4 h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? "Drop the images here..."
            : "Drag 'n' drop catalogue card images, or click to select"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports JPG, JPEG, PNG (multiple files allowed)
        </p>
      </div>
    </div>
  );
}