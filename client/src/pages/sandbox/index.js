import React, { useState, useEffect } from 'react';
import {
  Grid,
  Heading,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  TabList,
  Tabs,
  Tab,
  TabPanel,
  TabPanels,
  Button,
  Flex,
} from '@chakra-ui/react';
import { MdAccessTime, MdArrowUpward, MdArrowDownward } from 'react-icons/md';

import StatsCard from '../../components/statsCard/StatsCard';
import { Link } from 'react-router-dom';
import HeaderWrapper from '../../hoc/HeaderWrapper';
import UsageTable from './UsageTable';
import OperationsTable from './OperationsTable';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';

function Sandbox(props) {
  const [sandboxUsageDetails, setSandboxUsageDetails] = useState([]);
  const [sandboxOperationDetails, setSandboxOperationDetails] = useState([]);
  const [sandBoxLinks, setSandboxLinks] = useState({});
  const { id: sandboxId } = props.match.params;
  const { getRequest } = useAxios();
  const { errorToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);

  // get data of a sandbox
  const getSandboxData = async () => {
    setIsLoading(true);
    // const sandboxUsageStats = await getRequest(`/sandbox/stats/${sandboxId}/usage`);
    // setIsLoading(false);
    // if (sandboxUsageStats.error) {
    //   errorToastMessage({
    //     title: sandboxUsageStats.message,
    //   });
    //   return;
    // }
  };

  // get usage data of a sandbox
  const getSandboxUsageData = async () => {
    setIsLoading(true);
    const sandboxUsageStats = await getRequest(
      `/sandbox/stats/${sandboxId}/usage`
    );
    setIsLoading(false);
    if (sandboxUsageStats.error) {
      errorToastMessage({
        title: sandboxUsageStats.message,
      });
      return;
    }
    setSandboxUsageDetails(sandboxUsageStats);
  };

  const getSandboxOperations = async () => {
    setIsLoading(true);
    const sandboxOperations = await getRequest(
      `/sandbox/stats/${sandboxId}/operations`
    );
    setIsLoading(false);
    if (sandboxOperations.error) {
      errorToastMessage({
        title: sandboxOperations.message,
      });
      return;
    }
    setSandboxOperationDetails(sandboxOperations);
  };

  const getSandboxLinks = async () => {
    setIsLoading(true);
    const sandboxListOfLinks = await getRequest(`/sandbox/link/${sandboxId}/`);
    setIsLoading(false);
    if (sandBoxLinks.error) {
      errorToastMessage({
        title: sandBoxLinks.message,
      });
      return;
    }
    setSandboxLinks(sandboxListOfLinks.sandbox.links);
  };

  useEffect(() => {
    getSandboxUsageData();
    getSandboxLinks();
    getSandboxOperations();
    getSandboxData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HeaderWrapper pageTitle='Home'>
      <Heading my='4'>Sandbox: {sandboxId}</Heading>
      <Grid templateColumns='repeat(3,1fr)' gap='2'>
        <StatsCard
          icon={<MdAccessTime />}
          title='Sandbox Seconds'
          content={sandboxUsageDetails && sandboxUsageDetails.sandboxSeconds}
        />
        <StatsCard
          icon={<MdArrowUpward style={{ color: 'green' }} />}
          title='Minutes up'
          content={sandboxUsageDetails && sandboxUsageDetails.minutesUp}
        />
        <StatsCard
          icon={<MdArrowDownward style={{ color: 'tomato' }} />}
          title='Minutes Down'
          content={sandboxUsageDetails && sandboxUsageDetails.minutesDown}
        />
      </Grid>

      <Tabs my='4'>
        <TabList w='full'>
          <Flex justifyContent='space-between' w='full'>
            <Flex w='full'>
              <Tab>Usage Table</Tab>
              <Tab>Sandbox Operations</Tab>
            </Flex>
            <Menu>
              <MenuButton
                as={Button}
                variant='solid'
                colorScheme='twitter'
                px='10'
                my='2'
              >
                Links
              </MenuButton>

              <MenuList>
                {Object.keys(sandBoxLinks).map((key) => (
                  <MenuItem key={key}>
                    <Link to={{ pathname: sandBoxLinks[key] }} target='_blank'>
                      {key}
                    </Link>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UsageTable usageData={sandboxUsageDetails} />
          </TabPanel>
          <TabPanel>
            <OperationsTable operationsData={sandboxOperationDetails} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {isLoading && <CenterSpinner />}
    </HeaderWrapper>
  );
}

export default Sandbox;
