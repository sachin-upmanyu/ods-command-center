import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Text,
  Flex,
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
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
        title: res.message,
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
        title: res.message,
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
        title: res.message,
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
        title: res.message,
      });
      return;
    }
    successToastMessage({title: 'Data fetched'});
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
        title: res.message,
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
        title: res.message,
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
        title: res.message,
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
        title: res.message,
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
        title: res.message,
      });
      return;
    }
    window.location.reload();
  };

  useEffect(() => {
    setSandboxDataFromServer(sandboxTableList);
  }, [sandboxTableList])

  return (
    <Box bg='white' border='1px solid' borderColor='gray.300' w='full'>
      <Box p='4'>
        <Heading size='lg'>Sandboxes</Heading>
        <Flex justifyContent='space-between' alignItems='center'>
          <Flex>
            <Text mr='2'>Created: {realmData.createdSandboxes - realmData.deletedSandboxes}</Text>
            <Text mr='2'>Active: {realmData.createdSandboxes}</Text>
            <Text>Deleted: {realmData.deletedSandboxes}</Text>
          </Flex>
          <Flex>
            <Button colorScheme='twitter' mx='1' onClick={handleRestartAll}>
              Restart all
            </Button>
            <Button colorScheme='twitter' mx='1' onClick={handleStartAll}>
              Start all
            </Button>
            <Button colorScheme='twitter' mx='1' onClick={handleStopAll}>
              Stop all
            </Button>
            <IconButton mx='1' onClick={handleRefresh}>
              <FiRefreshCw />
            </IconButton>
          </Flex>
        </Flex>
      </Box>
      <Table my='1' overflowY='scroll' maxHeight='500px' display='block'>
        <Thead>
          <Tr>
            {tableColumns.map((c, i) => (
              <Th key={i}>{c}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {sandboxDataFromServer &&
            sandboxDataFromServer.map((s) => (
              <Tr key={s.id}>
                <Td color="#1da1f2">
                  <Link to={`/sandbox/${s.id}`}>{s.id}</Link>
                </Td>
                <Td>{s.instance}</Td>
                <Td>{s.state}</Td>
                <Td>{s.createdBy}</Td>
                <Td>
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                  }).format(new Date(s.createdAt))}
                </Td>
                <Td>
                  <Menu>
                    <MenuButton>
                      <MdMoreVert />
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={()=>handleStart(s.id)}>Start</MenuItem>
                      <MenuItem onClick={()=>handleStop(s.id)}>Stop</MenuItem>
                      <MenuItem onClick={()=>handleRestart(s.id)}>Restart</MenuItem>
                      <MenuItem onClick={()=>window.confirm('Are you sure you want to reset Sandbox?') && handleReset(s.id) }>Reset</MenuItem>
                      <MenuItem onClick={()=>window.confirm('Are you sure you want to reset Delete?') && handleDelete(s.id) }>Delete</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      {isLoading && <CenterSpinner/>}
    </Box>
  );
}

export default SandboxTable;
