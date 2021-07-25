import React, { useState, useEffect } from 'react';
import {
  Text,
  Box,
  Heading,
  Flex,
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Grid,
} from '@chakra-ui/react';
import { FiRefreshCw } from 'react-icons/fi';
import { MdMoreVert } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';

function SchedulerDetails({ sandboxTableList, realmId, realmData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { getRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [sandboxDataFromServer, setSandboxDataFromServer] = useState([]);
  // useEffect(() => {
  //   setSandboxDataFromServer(sandboxTableList);
  // }, [sandboxTableList]);

  return (
    <Flex
      flexDir='column'
      bg='white'
      w='full'
      border='1px solid'
      borderColor='gray.100'
      overflow='auto'
      my='1'
      maxHeight='500px'
      minW='500px'
      p='2'
    >
      <Grid
        templateColumns='4fr 1fr 1fr 4fr 2fr 1fr'
        templateRows='repeat(auto-fill, 75px)'
        columnGap='4'
        rowGap='6'
        placeItems='start'
        px='4'
        boxSizing='border-box'
        alignItems='center'
        minW='1000px'
      >
        <Box my='4' w='full' gridColumn='1/-1'>
          <Heading size='lg'>Sandbox Scheduling</Heading>
          <Flex justifyContent='space-between' alignItems='center' w='full'>
            <Flex w='full'>
              <Text mr='2'>Created:</Text>
            </Flex>
            <Flex
              display={{ base: 'none', md: 'flex' }}
              w='full'
              justifyContent='flex-end'
            >
              <IconButton mx='1' >
                <FiRefreshCw />
              </IconButton>
            </Flex>
            <Flex display={{ base: 'flex', md: 'none' }}>
              <IconButton mx='1'>
                <FiRefreshCw />
              </IconButton>
              <Menu>
                <MenuButton
                  display='flex'
                  justifyContent='center'
                  colorScheme='gray'
                  as={Button}
                  px='3'
                >
                  <MdMoreVert />
                </MenuButton>
              </Menu>
            </Flex>
          </Flex>
        </Box>
      </Grid>
      {isLoading && <CenterSpinner />}
    </Flex>
  );
}

export default SchedulerDetails;
