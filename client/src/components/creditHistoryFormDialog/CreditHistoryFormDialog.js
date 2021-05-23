import React, { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  Input,
  FormControl,
  FormLabel,
  Grid,
  Button,
  ModalBody,
  ModalOverlay,
  Checkbox,
} from '@chakra-ui/react';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../centerSpinner/CenterSpinner';

const initialState = {
  credit: 0,
  purchaseDate: Date.now(),
  linkToTicket: '',
  autoRenewal: 0,
};

function CreditHistoryFormDialog({ isOpen, handleClose, submit, realmId }) {
  const [state, setState] = useState(initialState);
  const { postRequest } = useAxios();
  const { errorToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setState(initialState);
    handleClose();
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleChangeCheckbox = (event, newValue) => {
    const { checked, name } = event.target;
    setState((s) => ({ ...s, [name]: checked }));
  };

  const handleSubmit = async (event) => {
    // Post request
    event.preventDefault();
    setIsLoading(true);
    const res = await postRequest(`/credit/add/`, { ...state, realmId });
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message,
      });
      return;
    }
    // close dialog
    submit();
    window.location.reload();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Credits</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Grid gap='3' my='2'>
              <FormControl id='credit'>
                <FormLabel>Credit</FormLabel>
                <Input
                  name='credit'
                  value={state.credit}
                  type='number'
                  onChange={handleChange}
                  variant='filled'
                  min={1}
                />
              </FormControl>
              <FormControl id='purchaseDate'>
                <FormLabel>Date of purchase</FormLabel>
                <Input
                  name='purchaseDate'
                  value={state.createdDate}
                  type='date'
                  onChange={handleChange}
                  variant='filled'
                />
              </FormControl>
              <FormControl id='linkToTicket'>
                <FormLabel>Ticket Link</FormLabel>
                <Input
                  name='linkToTicket'
                  value={state.linkToTicket}
                  type='text'
                  onChange={handleChange}
                  variant='filled'
                />
              </FormControl>
              <FormControl id='autoRenewal'>
                <FormLabel>Auto Renewal</FormLabel>
                <Checkbox
                  name='autoRenewal'
                  value={state.autoRenewal}
                  onChange={handleChangeCheckbox}
                >
                  Checkbox
                </Checkbox>
              </FormControl>
              <Grid templateColumns='repeat(2, 1fr)' gap='2'>
                <Button
                  onClick={handleClose}
                  variant='outline'
                  colorScheme='red'
                >
                  Cancel
                </Button>
                <Button type='submit' variant='solid' colorScheme='twitter'>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </ModalBody>
      </ModalContent>
      {isLoading && <CenterSpinner />}
    </Modal>
  );
}

export default CreditHistoryFormDialog;
