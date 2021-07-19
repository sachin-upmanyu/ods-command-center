import React, { useState } from 'react';
import {
  Text,
  Heading,
  Flex,
  Button,
  IconButton,
  Grid,
} from '@chakra-ui/react';
import { MdDelete } from 'react-icons/md';
import { creditHistoryTableColumns } from '../../utils/sandboxes';
import { useEffect } from 'react';
import CreditHistoryFormDialog from '../../components/creditHistoryFormDialog/CreditHistoryFormDialog';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';

function CreditHistory({ realmId }) {
  const [credits, setCredits] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { getRequest, deleteRequestSingle } = useAxios();
  const { errorToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);

  const getCredits = async (realmId) => {
    if (realmId) {
      setIsLoading(true);
      const res = await getRequest(`/credit/get-list/${realmId}`);
      setIsLoading(false);
      if (res.error) {
        errorToastMessage({
          title: res.message ?? 'Error Occurred, please try again',
        });
        return;
      }
      setCredits(res);
    }
  };

  const toggleDialog = () => {
    setIsOpen((o) => !o);
  };

  const handleSubmit = () => {
    toggleDialog((o) => !o);
    getCredits(realmId);
  };

  const deleteCredit = async (credit) => {
    setIsLoading(true);
    const res = await deleteRequestSingle(`/credit/delete/${credit.id}`);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    window.location.reload();
    /* TODO:// Do action needed to be done after Delete */
  };

  useEffect(() => {
    getCredits(realmId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realmId]);

  return (
    <Flex
      bg='white'
      w='full'
      border='1px solid'
      borderColor='gray.300'
      overflow='auto'
      minW='500px'
      alignItems='top'
      flexDir='column'
      p='2'
    >
      <Flex justifyContent='space-between' alignItems='center' py='4'>
        <Heading size='lg'>Credit History</Heading>
        <Button colorScheme='twitter' mx='1' px='10' onClick={toggleDialog}>
          Add
        </Button>
      </Flex>
      <Grid
        templateColumns='1fr 2fr 2fr 1fr 1fr'
        templateRows='repeat(auto-fill, 50px)'
        columnGap='4'
        rowGap='2'
        placeItems='start'
        px='4'
        boxSizing='border-box'
        alignItems='center'
        minW='500px'
        overflowY='auto'
      >
        {creditHistoryTableColumns.map((c, i) => (
          <Heading key={i} size='sm' mt='2'>
            {c}
          </Heading>
        ))}
        {credits.map((c, index) => (
          <React.Fragment key={index}>
            <Text>{index + 1}</Text>
            <Text>{c.credit}</Text>
            <Text>
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              }).format(new Date(c.purchaseDate))}
            </Text>
            <Text>
              {c.autoRenewal === 1 || c.autoRenewal === '1' ? 'Yes' : 'No'}
            </Text>
            <Text fontSize='2rem' color='red.500'>
              <IconButton
                variant='ghost'
                fontSize='2xl'
                onClick={() => deleteCredit(c)}
              >
                <MdDelete />
              </IconButton>
            </Text>
          </React.Fragment>
        ))}
      </Grid>
      <CreditHistoryFormDialog
        isOpen={isOpen}
        submit={handleSubmit}
        handleClose={toggleDialog}
        realmId={realmId}
      />
      {isLoading && <CenterSpinner />}
    </Flex>
  );
}

export default CreditHistory;
