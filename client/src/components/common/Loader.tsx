import React from 'react';
import { motion } from 'framer-motion';

interface LoaderProps {
  size?: number;
  label?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 32, label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center space-y-3 py-8">
    <motion.span
      className="inline-flex h-12 w-12 items-center justify-center rounded-full border-4 border-primary-200 border-t-primary-500"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      style={{ width: size, height: size }}
    />
    {label && <span className="text-sm text-neutral-500">{label}</span>}
  </div>
);
