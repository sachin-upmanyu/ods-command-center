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
  Textarea,
  Text,
  GridItem,
  Select,
} from "@chakra-ui/react";
import { useAxios } from "../../hooks/axiosHook";
import { useToastMessage } from "../../hooks/toastHook";
import CenterSpinner from "../centerSpinner/CenterSpinner";

const initialState = {
  ttl: 0,
  autoSchedule: false,
};

function SandBoxUpdateFormDialog({ isOpen, handleClose, sandBoxId, autoSchedule, handleSubmit }) {
  const [state, setState] = useState(initialState);
  const { patchRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);


  const updateState = () => {
    let ttl = 0;
    setState({
      ...initialState,
      ttl,
      autoSchedule,
    });
  };
  const onClose = () => {
    setState(...initialState);
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleChangeCheckbox = (event, newValue) => {
    const { checked, name } = event.target;
    setState((s) => ({ ...s, [name]: checked }));
  };

  const handleFormSubmit = async (event) => {
    // Post request
    event.preventDefault();
    setIsLoading(true);
    const res = await patchRequest(`/sandbox/update/${sandBoxId}`, { ...state, sandBoxId });
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? "Error Occurred, please try again",
      });
      return;
    } else {
      successToastMessage({ title: `Sandbox Configuration has been updated.`  });
    }
    handleSubmit();
    // close dialog
  };

  useEffect(() => {
    console.log(sandBoxId, autoSchedule)

    updateState();
  }, [autoSchedule]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Update Sandbox Configuration</ModalHeader>
        <ModalBody>
          <Grid templateColumns="5fr 2fr" gap="4" alignItems="center" p="2">
            <GridItem
              rowGap="4"
              border="1px"
              borderColor="gray.200"
              p="2"
              borderRadius="lg"
              rowSpan={4}
            >
              <Text as="b" pt="2">
                TTL
              </Text>
              <Text mb="4">
                The TTL (time to live) in hours. The value must adhere to the maximum TTL
                quotas). If the sandbox age reaches its TTL, it will be deleted
                automatically.
              </Text>
              <Text as="b">Auto Scheduled?</Text>
              <Text mb="4">
                The Auto Scheduled flag controls if the sandbox is being auto
                scheduled according to the schedule configured at sandbox realm
                level. If omitted the sandbox is not auto scheduled.
              </Text>
            </GridItem>
            <GridItem
              rowGap="4"
              border="1px"
              borderColor="gray.200"
              p="2"
              borderRadius="lg"
              rowSpan={4}
              height="100%"
            >
              <form onSubmit={handleFormSubmit}>
                
                <Grid gap="3" my="2">
                  <FormControl id="ttl">
                    <FormLabel>TTL</FormLabel>
                    <Input
                      name="ttl"
                      value={state.ttl}
                      type="number"
                      onChange={handleChange}
                      variant="filled"
                      min={0}
                    />
                  </FormControl>
                  <FormControl id="autoSchedule">
                    <Checkbox
                      name="autoSchedule"
                      value={state.autoSchedule}
                      isChecked={state.autoSchedule}
                      onChange={handleChangeCheckbox}
                    >
                      Auto Scheduled
                    </Checkbox>
                  </FormControl>
                  <Grid templateColumns="repeat(2, 1fr)" gap="2" justifyContent="flex-end">
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      colorScheme="red"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="solid" colorScheme="twitter">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </GridItem>
          </Grid>
        </ModalBody>
      </ModalContent>
      {isLoading && <CenterSpinner />}
    </Modal>
  );
}

export default SandBoxUpdateFormDialog;
