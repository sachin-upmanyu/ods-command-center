import React, { useState } from "react";
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
  profile: "medium",
  // ocapiSettings: "",
  // webdavSettings: "",
  autoSchedule: 0,
};

function SandBoxFormDialog({ isOpen, handleClose, realmId, handleSubmit }) {
  const [state, setState] = useState(initialState);
  const { postRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => {
    setState(...initialState);
    handleClose();
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    console.log(value, name);
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
    const res = await postRequest(`/sandbox/create/`, { ...state, realmId });
    console.log(res, state);
    setIsLoading(false);
    if (res.error) {
      errorToastMessage({
        title: res.message ?? "Error Occurred, please try again",
      });
      return;
    } else {
      successToastMessage({ title: res.message });
    }
    handleSubmit();
    // close dialog
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Add SandBox</ModalHeader>
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
              <Text mb="4">
                You must have permission to create a new sandbox for the realm.
                The number of sandboxes allowed to create is limited. The
                command only trigger the creation and does not wait until the
                sandbox is fully up and running. Use may use refresh the Sandbox
                list to check the status of the sandbox.
              </Text>
              <Text as="b" pt="2">
                TTL
              </Text>
              <Text mb="4">
                The TTL (time to live) in hours of the sandbox can be modified
                via the --ttl flag. The value must adhere to the maximum TTL
                quotas). If the sandbox age reaches its TTL, it will be deleted
                automatically.
              </Text>
              <Text as="b">Auto Scheduled?</Text>
              <Text mb="4">
                The Auto Scheduled flag controls if the sandbox is being auto
                scheduled according to the schedule configured at sandbox realm
                level. If omitted the sandbox is not auto scheduled.
              </Text>
              <Text as="b">Sandbox Profile</Text>
              <Text>
                Use the Profile dropdown to set the resource allocation for the
                sandbox, "medium" is the default. Be careful, more powerful
                profiles consume more credits. Supported values are: medium,
                large, xlarge.
              </Text>
            </GridItem>
            <GridItem
              rowGap="4"
              border="1px"
              borderColor="gray.200"
              p="2"
              borderRadius="lg"
              rowSpan={4}
            >
              <form onSubmit={handleFormSubmit}>
                <Text as="b" fontSize="4xl" textAlign="center">
                  ADD
                </Text>
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
                  <FormControl id="profile">
                    <FormLabel>Profile</FormLabel>
                    <Select
                      placeholder="Select option"
                      isRequired="true"
                      variant="filled"
                      onChange={handleChange}
                      name="profile"
                      value={state.profile}
                    >
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="xlarge">XLarge</option>
                    </Select>
                  </FormControl>
                  <FormControl id="autoSchedule">
                    <Checkbox
                      name="autoSchedule"
                      value={state.autoSchedule}
                      onChange={handleChangeCheckbox}
                    >
                      Auto Scheduled
                    </Checkbox>
                  </FormControl>
                  {/* <FormControl id="ocapiSettings">
                <FormLabel>Ocapi Settings</FormLabel>
                <Textarea
                  placeholder="Ocapi Settings"
                  name="ocapiSettings"
                  variant="filled"
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl id="webdavSettings">
                <FormLabel>Webdav Settings</FormLabel>
                <Textarea
                  placeholder="Webdav Settings"
                  name="webdavSettings"
                  variant="filled"
                  onChange={handleChange}
                />
              </FormControl> */}
                  <Grid templateColumns="repeat(2, 1fr)" gap="2">
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

export default SandBoxFormDialog;
