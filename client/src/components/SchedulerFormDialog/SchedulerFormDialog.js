import React, { useState, useEffect } from "react";
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
  CheckboxGroup,
} from "@chakra-ui/react";
import { useAxios } from "../../hooks/axiosHook";
import { useToastMessage } from "../../hooks/toastHook";
import CenterSpinner from "../centerSpinner/CenterSpinner";

const initialState = {
  start_time: "",
  stop_time: "",
  weekdays: [],
};

const daysList = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

function SchedulerFormDialog({
  isOpen,
  handleClose,
  handleSubmit,
  realmId,
  realmData,
}) {
  const [state, setState] = useState(initialState);
  const { patchRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    updateState();

    handleClose();
  };

  const updateState = () => {
    let start_time = '';
    let stop_time = '';
    let weekdays = [];

    if (realmData && realmData.startScheduler) {
      start_time = realmData.startScheduler.time;
      stop_time = realmData.stopScheduler.time;
      weekdays = realmData.startScheduler.weekdays
    }

    setState({
      ...initialState,
      start_time,
      stop_time,
      weekdays,
    });
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleChangeCheckbox = (event) => {
    setState((s) => ({ ...s, weekdays: event }));
  };

  const handleFormSubmit = async (event) => {
    // Post request
    event.preventDefault();
    setIsLoading(true);

    let formArr = {
      realmId: realmId,
      schedule: {
        stopScheduler: {
          weekdays: state.weekdays,
          time: state.stop_time,
        },
        startScheduler: {
          weekdays: state.weekdays,
          time: state.start_time,
        },
      },
    };
    const res = await patchRequest(`/sandbox/realm/config/update`, { formArr });
    if (res.stopScheduler && res.startScheduler) {
      window.location.reload();
    }
    // const res = 'dsf';
    if (res.error) {
      errorToastMessage({
        title: res.message ?? "Error Occurred, please try again",
      });
      return;
    }
    handleSubmit(res);
    successToastMessage({ title: "Schedule updated successfully" });
    setIsLoading(false);
  };

  useEffect(() => {
    updateState();
  }, [realmData]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Scheduler Time</ModalHeader>
        <ModalBody>
          <form onSubmit={handleFormSubmit}>
            <Grid gap="3" my="2">
              <FormControl id="start_time">
                <FormLabel>Start Time (in GMT)</FormLabel>
                <Input
                  name="start_time"
                  value={state.start_time}
                  type="time"
                  onChange={handleChange}
                  variant="filled"
                  required="required"
                />
              </FormControl>
              <FormControl id="stop_time">
                <FormLabel>Stop Time (in GMT)</FormLabel>
                <Input
                  name="stop_time"
                  value={state.stop_time}
                  type="time"
                  onChange={handleChange}
                  variant="filled"
                  required="required"
                />
              </FormControl>

              <CheckboxGroup
                onChange={handleChangeCheckbox}
                value={state.weekdays}
                isRequired="true"
              >
                {daysList.map((day) => (
                  <Checkbox key={day} value={day}>{day}</Checkbox>
                ))}
              </CheckboxGroup>

              <Grid templateColumns="repeat(2, 1fr)" gap="2">
                <Button onClick={onClose} variant="outline" colorScheme="red">
                  Cancel
                </Button>
                <Button type="submit" variant="solid" colorScheme="twitter">
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
