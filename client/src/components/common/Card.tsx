import { Card as ChakraCard } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const MotionCard = motion.create(ChakraCard.Root);

interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  variant?: 'elevated' | 'outline' | 'subtle';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  variant = 'elevated',
  className,
}) => {
  return (
    <MotionCard
      variant={variant}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(title || subtitle || headerAction) && (
        <ChakraCard.Header>
          <div className="flex justify-between items-start">
            <div>
              {title && <ChakraCard.Title>{title}</ChakraCard.Title>}
              {subtitle && (
                <ChakraCard.Description>{subtitle}</ChakraCard.Description>
              )}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </ChakraCard.Header>
      )}
      <ChakraCard.Body>{children}</ChakraCard.Body>
      {footer && <ChakraCard.Footer>{footer}</ChakraCard.Footer>}
    </MotionCard>
  );
};
