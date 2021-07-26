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
  start_time: '',
  stop_time: '',
  monday: 0,
  tuesday: 0,
  wednesday: 0,
  thursday: 0,
  friday: 0,
  saturday: 0,
  sunday: 0,
};

function SchedulerFormDialog({ isOpen, handleClose, submit, realmId }) {
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
        title: res.message ?? 'Error Occurred, please try again',
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
        <ModalHeader>Update Scheduler Time</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Grid gap='3' my='2'>
              <FormControl id='start_time'>
                <FormLabel>Start Time</FormLabel>
                <Input
                  name='start_time'
                  value={state.start_time}
                  type='time'
                  onChange={handleChange}
                  variant='filled'
                />
              </FormControl>
              <FormControl id='stop_time'>
                <FormLabel>Stop Time</FormLabel>
                <Input
                  name='stop_time'
                  value={state.stop_time}
                  type='time'
                  onChange={handleChange}
                  variant='filled'
                />
              </FormControl>
              <FormLabel>Days</FormLabel>
              <FormControl id='monday'>
                <Checkbox
                  name='monday'
                  value={state.monday}
                  onChange={handleChangeCheckbox}
                >
                  Monday
                </Checkbox>
              </FormControl>
              <FormControl id='tuesday'>
                <Checkbox
                  name='tuesday'
                  value={state.tuesday}
                  onChange={handleChangeCheckbox}
                >
                  Tuesday
                </Checkbox>
              </FormControl>
              <FormControl id='wednesday'>
                <Checkbox
                  name='wednesday'
                  value={state.wednesday}
                  onChange={handleChangeCheckbox}
                >
                  Wednesday
                </Checkbox>
              </FormControl>
              <FormControl id='thursday'>
                <Checkbox
                  name='thursday'
                  value={state.thursday}
                  onChange={handleChangeCheckbox}
                >
                  Thursday
                </Checkbox>
              </FormControl>
              <FormControl id='friday'>
                <Checkbox
                  name='friday'
                  value={state.friday}
                  onChange={handleChangeCheckbox}
                >
                  Friday
                </Checkbox>
              </FormControl>
              <FormControl id='saturday'>
                <Checkbox
                  name='saturday'
                  value={state.saturday}
                  onChange={handleChangeCheckbox}
                >
                  Saturday
                </Checkbox>
              </FormControl>
              <FormControl id='sunday'>
                <Checkbox
                  name='sunday'
                  value={state.sunday}
                  onChange={handleChangeCheckbox}
                >
                  Sunday
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

export default SchedulerFormDialog;
