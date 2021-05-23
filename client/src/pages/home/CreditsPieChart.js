import React, { useEffect, useState } from 'react';
import { Box, Heading, Flex, Text } from '@chakra-ui/react';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';
import { PieChart } from 'react-minimal-pie-chart';

function CreditsPieChart({ realmDataFromServer }) {
  const [isShowChart, setIsShowChart] = useState(false);

  const { getRequest } = useAxios();
  const { errorToastMessage } = useToastMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [minutesUp, setMinutesUp] = useState(0);
  const [minutesDown, setMinutesDown] = useState(0);
  const [creditsRemaining, setCreditsRemaining] = useState(0);

  const getCredits = async (realmId) => {
    if (realmId) {
      setIsLoading(true);
      const res = await getRequest(`/credits-usage/${realmId}`);
      setIsLoading(false);
      if (res.error) {
        errorToastMessage({
          title: res.message,
        });
        return;
      }
      if (res.creditList && res.creditList.total_credits) {
        setMinutesUp(res.returnData.minutesUp/res.creditList.total_credits);
        setMinutesDown(0.3*res.returnData.minutesDown/res.creditList.total_credits);
      } else {
        setMinutesUp(0);
        setMinutesDown(0);
      }
      setCreditsRemaining(100 - res.remainingCreditPercent);
      if (res.remainingCreditPercent > 90) {
        errorToastMessage({
          title: 'Credit Consumption Alert',
          description: 'Please add credit',
          duration: null
        });
      }
      setIsShowChart(true);
    }
  };

  useEffect(() => {
    getCredits(realmDataFromServer.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [realmDataFromServer]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return (
    <Box bg='white' border='1px solid' borderColor='gray.300' p='4' w='45%'>
      <Heading fontSize='lg'>Sandbox Statistics</Heading>
      <Box mt='50px'>
        {(isShowChart && (
          <>
          <PieChart
            animation
            animationDuration={500}
            animationEasing="ease-out"
            center={[50, 50]}
            data={[
              { title: (minutesDown*100).toFixed(2)+'%', value: minutesDown*100, color: '#E38627' },
              { title: (minutesUp*100).toFixed(2)+'%', value: minutesUp*100, color: '#C13C37' },
              { title: creditsRemaining.toFixed(2)+'%', value: creditsRemaining, color: '#6A2135' },
            ]}
            labelPosition={50}
            lengthAngle={360}
            lineWidth={15}
            paddingAngle={0}
            radius={50}
            rounded
            startAngle={0}
            viewBoxSize={[100, 100]}
          />
          <Flex>
            <Box h="5" w="5" bg="#E38627" rounded="full"></Box>
            <Text>Mins Down</Text>
          </Flex>
          <Flex>
            <Box h="5" w="5" bg="#C13C37" rounded="full"></Box>
            <Text>Mins Up</Text>
          </Flex>
          <Flex>
            <Box h="5" w="5" bg="#6A2135" rounded="full"></Box>
            <Text>Mins Remaining</Text>
          </Flex>
          </>
        )) || <Text>No Credit History</Text>}
      </Box>
      {isLoading && <CenterSpinner />}
    </Box>
  );
}

export default CreditsPieChart;
