import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  Flex,
  Button,
  IconButton,
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
          title: res.message,
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
        title: res.message,
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
    <Box bg='white' border='1px solid' borderColor='gray.300' w='full' m='2'>
      <Flex justifyContent='space-between' alignItems='center' p='4'>
        <Heading size='lg'>Credit History</Heading>
        <Button colorScheme='twitter' mx='1' px='10' onClick={toggleDialog}>
          Add
        </Button>
      </Flex>
      <Table my='1'>
        <Thead>
          <Tr>
            {creditHistoryTableColumns.map((c, i) => (
              <Th key={i}>{c}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {credits.map((c, index) => (
            <Tr key={index}>
              <Td>{index + 1}</Td>
              <Td>{c.credit}</Td>
              <Td>
                {new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                }).format(new Date(c.purchaseDate))}
              </Td>
              <Td>{c.autoRenewal=== 1 || c.autoRenewal === '1' ? 'Yes' : 'No'}</Td>
              <Td fontSize='2rem' color='red.500'>
                <IconButton
                  variant='ghost'
                  fontSize='2xl'
                  onClick={() => deleteCredit(c)}
                >
                  <MdDelete />
                </IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <CreditHistoryFormDialog
        isOpen={isOpen}
        submit={handleSubmit}
        handleClose={toggleDialog}
        realmId={realmId}
      />
      {isLoading && <CenterSpinner />}
    </Box>
  );
}

export default CreditHistory;
