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
  weekdays: []
};

function SchedulerFormDialog({ isOpen, handleClose, submit, realmId }) {
  const [state, setState] = useState(initialState);
  const { patchRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
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
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((cur, ind) => {
    return (
      <FormControl id={ind}>
        <Checkbox
          name={cur}
          value={cur}
          onChange={handleChangeCheckbox}
        >
          {cur}
        </Checkbox>
      </FormControl>
    )
  })

  const handleSubmit = async (event) => {
    // Post request
    event.preventDefault();
    setIsLoading(true);

    let weekdays = [];
    if (state.Monday) weekdays.push('MONDAY')
    if (state.Tuesday) weekdays.push('TUESDAY')
    if (state.Wednesday) weekdays.push('WEDNESDAY')
    if (state.Thursday) weekdays.push('THURSDAY')
    if (state.Friday) weekdays.push('FRIDAY')
    if (state.Saturday) weekdays.push('SATURDAY')
    if (state.Sunday) weekdays.push('SUNDAY')

    let formArr = {
      "realmId":realmId,
      "schedule": {
        "stopScheduler": {
          "weekdays": weekdays,
          "time": state.stop_time
        },
        "startScheduler": {
          "weekdays": weekdays,
          "time": state.start_time
        }
      }
    }
    const res = await patchRequest(`/sandbox/realm/config/update`, { formArr });
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? 'Error Occurred, please try again',
      });
      return;
    }
    handleClose();
    successToastMessage({ title: 'Schedule updated successfully' });

    // close dialog
    try {
      submit();
    } catch(e) {
      console.log(e);
    }
    // window.location.reload();
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
                <FormLabel>Start Time (in GMT)</FormLabel>
                <Input
                  name='start_time'
                  value={state.start_time}
                  type='time'
                  onChange={handleChange}
                  variant='filled'
                />
              </FormControl>
              <FormControl id='stop_time'>
                <FormLabel>Stop Time (in GMT)</FormLabel>
                <Input
                  name='stop_time'
                  value={state.stop_time}
                  type='time'
                  onChange={handleChange}
                  variant='filled'
                />
              </FormControl>
              <FormLabel>Days</FormLabel>
              {daysOptions}
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
