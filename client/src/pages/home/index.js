import { Grid, Flex, Heading } from '@chakra-ui/react';

import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import StatsCard from '../../components/statsCard/StatsCard';
import HeaderWrapper from '../../hoc/HeaderWrapper';
import { AiOutlineCodeSandbox } from 'react-icons/ai';
import { useEffect } from 'react';
import SandboxTable from './SandboxTable';
import CreditsPieChart from './CreditsPieChart';
import CreditHistory from './CreditHistory';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';
import { BsStopwatch } from 'react-icons/bs';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';
import { RealmContext } from '../../context/RealmContext';

function Home() {
  const [sandboxes, setSandboxes] = useState([]);
  const [selectedRealmSandboxes, setSelectedRealmSandboxes] = useState([]);
  const [selectedRealm, setSelectedRealm] = useContext(RealmContext);
  const [realmsList, setRealmsList] = useState([]);
  const { getRequest } = useAxios();
  const { errorToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);

  const getRealmsList = async () => {
    setIsLoading(true);
    const res = await getRequest(`/sandbox/realms/list/`);
    setIsLoading(false);
    if (res.error) {
      const res = getRequest('/logout');
      if (res) {
        window.location.href = '/login';
      }
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    setRealmsList(res);
  };

  const selectRealm = async (realmId) => {
    /* 
      Add get request to fetch data of one realm using realmId
      fetch remaining credits for that realm
      fetch sandboxes of that realm
    */
    setIsLoading(true);
    const realmUsage = await getRequest(
      `/sandbox/realms/list/${realmId}/usage`
    );
    if (realmUsage.error) {
      errorToastMessage({
        title: realmUsage.message ?? 'Error Occurred, please try again',
      });
      setIsLoading(false);
      return;
    }

    // Change this call to something that sets the data not only id
    // Need of the selected realm data api
    setSelectedRealm(realmUsage);

    const res = await getRequest(`/credits-usage/${realmId}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }

    setSelectedRealm((r) => ({
      ...r,
      remainingCredits: res.remainingCredits,
    }));
    const x = sandboxes.filter((s) => s.realm === realmId);
    setSelectedRealmSandboxes(x);
  };

  const getSandboxData = async () => {
    setIsLoading(true);
    const data = await getRequest('/sandbox/list');
    setIsLoading(false);
    if (data.error) {
      errorToastMessage({
        title: data.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    setSandboxes(data);
  };

  useEffect(() => {
    getRealmsList();
    getSandboxData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (realmsList.length && sandboxes.length) {
      if (selectedRealm) {
        const x = sandboxes.filter((s) => s.realm === selectedRealm.id);
        setSelectedRealmSandboxes(x);
      } else {
        selectRealm(realmsList[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realmsList, sandboxes]);

  return (
    <HeaderWrapper
      pageTitle='Home'
      realms={realmsList}
      handleSelect={selectRealm}
    >
      <Helmet>Home</Helmet>
      {(selectedRealm && (
        <>
          <Heading>{selectedRealm.id}</Heading>
          <Flex flexWrap='wrap'>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
              gap='4'
              w='full'
              m='2'
            >
              <StatsCard
                title={'Number of Sandboxes'}
                content={
                  selectedRealm.createdSandboxes -
                  selectedRealm.deletedSandboxes
                }
                icon={<AiOutlineCodeSandbox />}
                color='twitter.500'
              />
              <StatsCard
                title='Credits Remaining'
                content={
                  selectedRealm.remainingCredits &&
                  selectedRealm.remainingCredits.toFixed(2)
                }
                icon={<BsStopwatch />}
                color='black'
              />
              <StatsCard
                title='Minutes Up'
                content={selectedRealm.minutesUp}
                icon={<MdArrowUpward />}
                color='green'
              />
              <StatsCard
                title='Minutes Down'
                content={selectedRealm.minutesDown}
                icon={<MdArrowDownward />}
                color='red'
              />
            </Grid>
            <Flex w='100%' p='2'>
              <SandboxTable
                sandboxTableList={selectedRealmSandboxes}
                realmId={selectedRealm.id}
                realmData={selectedRealm}
              />
            </Flex>
            <Grid
              templateColumns={{ base: 'repeat(1, 1fr)', lg: 'repeat(2,1fr)' }}
              gap='2'
              p='2'
              w='100%'
            >
              {selectedRealm.id && (
                <Flex w='100%' overflowX='auto'>
                  <CreditHistory realmId={selectedRealm.id} />
                </Flex>
              )}
              <CreditsPieChart realmDataFromServer={selectedRealm} />
            </Grid>
          </Flex>
        </>
      )) || <Heading>No realms</Heading>}
      {isLoading && <CenterSpinner />}
    </HeaderWrapper>
  );
}

export default Home;
