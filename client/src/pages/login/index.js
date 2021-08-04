import React, { useState } from 'react';
import { Box, Button, Divider, Flex, Heading, Input } from '@chakra-ui/react';
import { useAxios } from '../../hooks/axiosHook';
import { useToastMessage } from '../../hooks/toastHook';
import CenterSpinner from '../../components/centerSpinner/CenterSpinner';
import { useHistory } from 'react-router-dom';

function Login(props) {
  const history = useHistory();
  const { getRequest, postRequest } = useAxios();
  const { errorToastMessage } = useToastMessage();
  const [formState, setFormState] = useState({
    client: '',
    clientSecret: '',
    user: '',
    userPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [webClient, setWebClient] = useState('');
  // web authentication form handlers
  const handleChangeForWebAuthentication = (event) => {
    const { value } = event.target;
    setWebClient(value);
  };

  const handleAuthorize = async (event) => {
    event.preventDefault();
    const requestBody = { client: webClient };
    setIsLoading(true);
    const requestResult = await postRequest('/auth/login', {
      ...requestBody,
    });
    setIsLoading(false);
    if (requestResult.error) {
      errorToastMessage({
        title: requestResult.message,
      });
      return;
    }

    if (requestResult) {
      localStorage.setItem('token', requestResult);
      history.push('');
    }
  };

  // login form handlers
  const handleChange = (event) => {
    const updateState = { ...formState };
    const { name, value } = event.target;
    updateState[name] = value;
    setFormState(updateState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const requestResult = await postRequest('/client/login', {
      ...formState,
    });

    setIsLoading(false);
    if (requestResult.error) {
      errorToastMessage({
        title: requestResult.message,
      });
      return;
    }
    if (requestResult && requestResult.login) {
      localStorage.setItem('token', requestResult.token);
      history.push('');
    }
  };

  const handleFileLogin = async () => {
    setIsLoading(true);
    const requestResult = await getRequest('/dwjson/login');
    setIsLoading(false);

    if (requestResult && requestResult.login) {
      localStorage.setItem('token', requestResult.token);
      history.push('');
    }
  };

  return (
    <Flex
      justifyContent='center'
      minH='100vh'
      alignItems='center'
      background='#F4F4F4'
      p='10'
    >
      <Box background='#FFFFFF' padding='10' borderRadius='12px'>
        <Heading textAlign='center' my='4' color='twitter.500'>
          Login
        </Heading>
        <Heading size='md'>with Client ID (requires port 8080 to be available)</Heading>

        <form onSubmit={handleAuthorize}>
          <Input
            type='text'
            placeholder='Enter Client Id'
            value={webClient}
            variant='filled'
            onChange={handleChangeForWebAuthentication}
            name='webClient'
            my='2'
          />
          <Button variant='solid' colorScheme='twitter' type='submit'>
            Authorize
          </Button>
        </form>
        <Divider mt='10' mb='2' />
        <Heading size='md'>or with credentials</Heading>
        <form onSubmit={handleSubmit}>
          <Input
            type='text'
            placeholder='Enter Client Id'
            value={formState.client}
            onChange={handleChange}
            variant='filled'
            name='client'
            my='2'
          />
          <Input
            type='text'
            placeholder='Enter Client Secret'
            value={formState.clientSecret}
            onChange={handleChange}
            variant='filled'
            name='clientSecret'
            my='2'
          />
          <Input
            type='text'
            placeholder='Enter user'
            value={formState.user}
            variant='filled'
            onChange={handleChange}
            name='user'
            my='2'
          />
          <Input
            type='password'
            placeholder='Password'
            value={formState.userPassword}
            variant='filled'
            onChange={handleChange}
            name='userPassword'
            my='2'
          />
          <Button variant='solid' colorScheme='twitter' type='submit'>
            Login
          </Button>
        </form>
        <Divider mt='10' mb='2' />
        <Heading size='md'>or with dw.json (requires dw.json to be present in server)</Heading>
        <Button
          onClick={handleFileLogin}
          colorScheme='twitter'
          variant='solid'
          my='2'
        >
          Authorize with File
        </Button>
      </Box>
      {isLoading && <CenterSpinner />}
    </Flex>
  );
}

export default Login;
