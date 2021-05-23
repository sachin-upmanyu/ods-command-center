import { Box, Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

function CenterSpinner() {
  return (
    <Box
      position='fixed'
      h='100vh'
      top='0'
      left='0'
      width='100%'
      bg='#80808042'
    >
      <Flex
        height='100%'
        width='100%'
        position='sticky'
        alignItems='center'
        justifyContent='center'
      >
        <Spinner />
      </Flex>
    </Box>
  );
}

export default CenterSpinner;
