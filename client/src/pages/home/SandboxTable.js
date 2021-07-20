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
import { tableColumns } from '../../utils/sandboxes';
import { MdMoreVert } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';

function SandboxTable({ sandboxTableList, realmId, realmData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { getRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [sandboxDataFromServer, setSandboxDataFromServer] = useState([]);

  const handleStartAll = async () => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/start-all/${realmId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleStopAll = async () => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/stop-all/${realmId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleRestartAll = async () => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/restart-all/${realmId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/list`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    successToastMessage({ title: 'Data fetched' });
    if (res) {
      setSandboxDataFromServer(res);
    }
  };

  const handleStart = async (sandboxId) => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/start/${sandboxId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleStop = async (sandboxId) => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/stop/${sandboxId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleRestart = async (sandboxId) => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/restart/${sandboxId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleReset = async (sandboxId) => {
    setIsLoading(true);
    // //TODO change api request here
    const res = await getRequest(`/sandbox/reset/${sandboxId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  const handleDelete = async (sandboxId) => {
    setIsLoading(true);
    //TODO change api request here
    const res = await getRequest(`/sandbox/delete/${sandboxId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
  };

  useEffect(() => {
    setSandboxDataFromServer(sandboxTableList);
  }, [sandboxTableList]);

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
          <Heading size='lg'>Sandboxes</Heading>
          <Flex justifyContent='space-between' alignItems='center' w='full'>
            <Flex w='full'>
              <Text mr='2'>Created: {realmData.createdSandboxes}</Text>
              <Text mr='2'>
                Active:{' '}
                {realmData.createdSandboxes - realmData.deletedSandboxes}
              </Text>
              <Text>Deleted: {realmData.deletedSandboxes}</Text>
            </Flex>
            <Flex
              display={{ base: 'none', md: 'flex' }}
              w='full'
              justifyContent='flex-end'
            >
              <IconButton mx='1' onClick={handleRefresh}>
                <FiRefreshCw />
              </IconButton>
              <Button colorScheme='twitter' mx='1' onClick={handleRestartAll}>
                Restart all
              </Button>
              <Button colorScheme='twitter' mx='1' onClick={handleStartAll}>
                Start all
              </Button>
              <Button colorScheme='twitter' mx='1' onClick={handleStopAll}>
                Stop all
              </Button>
            </Flex>
            <Flex display={{ base: 'flex', md: 'none' }}>
              <IconButton mx='1' onClick={handleRefresh}>
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
                <MenuList>
                  <MenuItem onClick={handleRestartAll}>Restart all</MenuItem>
                  <MenuItem onClick={handleStartAll}>Start all</MenuItem>
                  <MenuItem onClick={handleStopAll}>Stop all</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Box>
        {tableColumns.map((c, i) => (
          <Heading key={i} size='sm' mt='2' alignSelf='end'>
            {c}
          </Heading>
        ))}

        {sandboxDataFromServer &&
          sandboxDataFromServer.map((s) => (
            <React.Fragment key={s.id}>
              <Text color='#1da1f2'>
                <Link to={`/sandbox/${s.id}`}>{s.id}</Link>
              </Text>
              <Text>{s.instance}</Text>
              <Text>{s.state}</Text>
              <Text>{s.createdBy}</Text>
              <Text>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                }).format(new Date(s.createdAt))}
              </Text>
              <Menu>
                <MenuButton>
                  <MdMoreVert />
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleStart(s.id)}>Start</MenuItem>
                  <MenuItem onClick={() => handleStop(s.id)}>Stop</MenuItem>
                  <MenuItem onClick={() => handleRestart(s.id)}>
                    Restart
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      window.confirm(
                        'Are you sure you want to reset this sandbox (' +
                          s.instance +
                          ')?'
                      ) && handleReset(s.id)
                    }
                  >
                    Reset
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      window.confirm(
                        'Are you sure you want to delete this sandbox (' +
                          s.instance +
                          ')?'
                      ) && handleDelete(s.id)
                    }
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </React.Fragment>
          ))}
      </Grid>
      {isLoading && <CenterSpinner />}
    </Flex>
  );
}

export default SandboxTable;
