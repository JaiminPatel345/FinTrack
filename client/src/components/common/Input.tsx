import { Input as ChakraInput, Field } from '@chakra-ui/react';
import type { InputProps as ChakraInputProps } from '@chakra-ui/react';

interface InputProps extends ChakraInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  required,
  ...props
}) => {
  return (
    <Field.Root invalid={!!error} required={required}>
      {label && <Field.Label>{label}</Field.Label>}
      <ChakraInput {...props} />
      {helperText && !error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  );
};
