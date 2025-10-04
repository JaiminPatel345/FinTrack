import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from '@utils/helpers';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = true }) => (
  <motion.div
    whileHover={hover ? { translateY: -4 } : undefined}
    transition={{ duration: 0.2 }}
    className={classNames('card p-6', className)}
  >
    {children}
  </motion.div>
);
