import { Badge as ChakraBadge } from '@chakra-ui/react';
import type { BadgeProps as ChakraBadgeProps } from '@chakra-ui/react';

interface BadgeProps extends Omit<ChakraBadgeProps, 'colorScheme'> {
  children: React.ReactNode;
  variant?: 'solid' | 'subtle' | 'outline';
  colorScheme?: 'green' | 'blue' | 'red' | 'yellow' | 'gray' | 'orange' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'subtle',
  colorScheme = 'blue',
  ...props
}) => {
  return (
    <ChakraBadge variant={variant} colorPalette={colorScheme} {...props}>
      {children}
    </ChakraBadge>
  );
};

// Status-specific badges
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getColorScheme = (status: string) => {
    const statusMap: Record<string, 'green' | 'blue' | 'red' | 'yellow' | 'gray' | 'orange'> = {
      draft: 'gray',
      submitted: 'blue',
      pending_approval: 'yellow',
      approved: 'green',
      rejected: 'red',
      paid: 'green',
      pending: 'yellow',
    };
    return statusMap[status.toLowerCase()] || 'gray';
  };

  return (
    <Badge colorScheme={getColorScheme(status)}>
      {status.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};
