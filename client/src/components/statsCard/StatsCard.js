import React from 'react';
import { Flex, IconButton, Text } from '@chakra-ui/react';

function StatsCard({ title, content, icon, color }) {
  return (
    <Flex
      border='1px solid'
      borderColor='gray.300'
      justifyContent='space-between'
      p={{base:'1', md:'2'}}
      bg='white'
    >
      <IconButton variant='ghost' fontSize='4xl' color={color}>
        {icon}
      </IconButton>
      <Flex flexDirection='column'>
        <Text size='md' color="gray">{title}</Text>
        <Text>{content}</Text>
      </Flex>
    </Flex>
  );
}

export default StatsCard;
