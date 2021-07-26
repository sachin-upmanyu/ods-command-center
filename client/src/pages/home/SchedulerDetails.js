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
import StatsCard from '../../components/statsCard/StatsCard';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import SchedulerFormDialog from '../../components/SchedulerFormDialog/SchedulerFormDialog';

function SchedulerDetails({ sandboxTableList, realmId, realmData }) {
  const [isLoading, setIsLoading] = useState(false);
  const { getRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [noSandboxConfig, setNoSandboxConfig] = useState([]);
  const [sandboxConfig, setSandboxConfig] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => {
    setIsOpen((o) => !o);
  };

  const getSchedulerDetails = async (realmId) => {
    if (realmId) {
      setIsLoading(true);
      if (realmData && realmData.startScheduler) {
        setWeekdays(realmData.startScheduler['weekdays'].map(e => e.toLowerCase()).join(', '));

        // realmData.startScheduler['weekdays'].map
        setSandboxConfig(realmData);
        // realmData.startScheduler['weekdays']
      } else {
        setNoSandboxConfig('Sandbox Start Stop operations are not scheduled yet');
      }

      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSchedulerDetails(realmId);
  }, [realmData]);

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
        <Box my='4' w='full' gridColumn='1/-1' mt='55px'>
          <Heading size='lg'>Sandbox Scheduling</Heading>
          {(noSandboxConfig && noSandboxConfig !== '' && (
            <Flex justifyContent='space-between' alignItems='center' w='full'>
              <Flex w='full'>
                <Text mr='2'>{noSandboxConfig}</Text>
              </Flex>
            </Flex>
          )) }
          {(realmData.startScheduler && realmData.startScheduler['time'] !== '' && (

            <Flex flexWrap='wrap'>
                          <Flex
              display={{ base: 'none', md: 'flex' }}
              w='full'
              justifyContent='flex-end'
            >
              <IconButton mx='1'>
                <FiRefreshCw />
              </IconButton>
              <Button colorScheme='twitter' mx='1' px='10' onClick={toggleDialog}>
                Edit
              </Button>
            </Flex>
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(2, 1fr)',
                }}
                gap='80'
                w='full'
                m='2'
              >
                <StatsCard
                  title={ "Scheduled Start Time " + realmData.startScheduler['time'] + " (GMT)" }
                  content={ "On: " + weekdays }
                  icon={<MdArrowUpward />}
                  color='green'
                />
                <StatsCard
                  title={ "Scheduled Stop Time " + realmData.stopScheduler['time'] + " (GMT)" }
                  content={ "On: " + weekdays }
                  icon={<MdArrowDownward />}
                  color='red'
                />
              </Grid>
            </Flex>
          )) }
        </Box>
      </Grid>
      <SchedulerFormDialog
        isOpen={isOpen}
        handleClose={toggleDialog}
        realmId={realmId}
      />
      {isLoading && <CenterSpinner />}
    </Flex>
  );
}

export default SchedulerDetails;
