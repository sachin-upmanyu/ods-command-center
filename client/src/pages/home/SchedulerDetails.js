import React, { useState, useEffect } from "react";
import {
  Text,
  Box,
  Heading,
  Flex,
  Button,
  IconButton,
  Grid,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import { useAxios } from "../../hooks/axiosHook";
import { useToastMessage } from "../../hooks/toastHook";
import CenterSpinner from "../../components/centerSpinner/CenterSpinner";
import StatsCard from "../../components/statsCard/StatsCard";
import { MdArrowDownward, MdArrowUpward } from "react-icons/md";
import SchedulerFormDialog from "../../components/SchedulerFormDialog/SchedulerFormDialog";

function SchedulerDetails({
  sandboxTableList,
  realmId,
  realmData,
  handleDetailsUpdated,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { getRequest } = useAxios();
  const { errorToastMessage, successToastMessage } = useToastMessage();
  const [noSandboxConfig, setNoSandboxConfig] = useState([]);
  const [sandboxConfig, setSandboxConfig] = useState([]);
  const [weekdays, setWeekdays] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDialog = () => {
    setIsOpen((o) => !o);
    getSchedulerDetails(realmId);
  };

  const getSchedulerDetails = async (realmId) => {
    if (realmId) {
      setIsLoading(true);
      if (realmData && realmData.startScheduler) {
        setWeekdays(
          realmData.startScheduler["weekdays"]
            .map((e) => e)
            .join(", ")
        );
        setSandboxConfig(realmData);
        setNoSandboxConfig('');
      } else {
        setNoSandboxConfig(
          "Sandbox Start Stop operations are not scheduled yet"
        );
      }

      setIsLoading(false);
    }
  };

  const handleUpdate = (updatedRealmData) => {
    handleDetailsUpdated(updatedRealmData);
    toggleDialog();
  };

  useEffect(() => {
    getSchedulerDetails(realmId);
  }, [realmData]);

  return (
    <>
      <Box
        my="4"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        w="full"
        px="6"
        py="2"
      >
        <Flex justifyContent="space-between" w="full" my="2">
          <Heading size="lg">Sandbox Scheduling</Heading>
          {realmData && (
            <Flex
              display={{ base: "none", md: "flex" }}
              justifyContent="flex-end"
            >
              <Button
                colorScheme="twitter"
                mx="1"
                px="10"
                onClick={toggleDialog}
              >
                Update
              </Button>
            </Flex>
          )}
        </Flex>
        {noSandboxConfig && noSandboxConfig !== "" && (
          <Flex justifyContent="space-between" alignItems="center" w="full">
            <Flex w="full">
              <Text mr="2">{noSandboxConfig}</Text>
            </Flex>
          </Flex>
        )}

        {realmData.startScheduler && realmData.startScheduler.time !== "" && (
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
            }}
            // gridAutoColumns="fit-content(500px)"
            gap="60"
            w="full"
            justifyContent="space-between"
          >
            <StatsCard
              title={
                "Scheduled Start Time " +
                realmData.startScheduler["time"] +
                " (GMT)"
              }
              content={"On: " + weekdays}
              icon={<MdArrowUpward />}
              color="green"
            />
            <StatsCard
              title={
                "Scheduled Stop Time " +
                realmData.stopScheduler["time"] +
                " (GMT)"
              }
              content={"On: " + weekdays}
              icon={<MdArrowDownward />}
              color="red"
            />
          </Grid>
        )}
      </Box>
      <SchedulerFormDialog
        isOpen={isOpen}
        handleClose={toggleDialog}
        realmId={realmId}
        realmData={realmData}
        handleSubmit={handleUpdate}
      />
      {isLoading && <CenterSpinner />}
    </>
  );
}

export default SchedulerDetails;
