import { useToast } from '@chakra-ui/react';

const defaultOptions = {
  duration: 4000,
  position: 'top',
  isClosable: true,
};

export const useToastMessage = () => {
  const toast = useToast();
  return {
    successToastMessage: (options) =>
      toast({ ...defaultOptions, ...options, status: 'success' }),
    errorToastMessage: (options) =>
      toast({ ...defaultOptions, ...options, status: 'error' }),
    infoToastMessage: (options) =>
      toast({ ...defaultOptions, ...options, status: 'info' }),
  };
};
