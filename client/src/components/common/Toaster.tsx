import { Toaster as ChakraToaster } from '@chakra-ui/react';
import { toaster } from './Toast';

export const Toaster = () => {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <div>{toast.title}</div>
      )}
    </ChakraToaster>
  );
};
