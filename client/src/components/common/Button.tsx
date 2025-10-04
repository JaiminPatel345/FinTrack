import { Button as ChakraButton } from '@chakra-ui/react';
import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';

interface ButtonProps extends Omit<ChakraButtonProps, 'colorScheme'> {
  colorScheme?: string;
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'solid',
  colorScheme = 'brand',
  isLoading = false,
  loadingText,
  ...props
}) => {
  return (
    <ChakraButton
      variant={variant}
      colorPalette={colorScheme}
      loading={isLoading}
      loadingText={loadingText}
      {...props}
    >
      {children}
    </ChakraButton>
  );
};
