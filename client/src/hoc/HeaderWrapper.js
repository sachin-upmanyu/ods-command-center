import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { AiFillCaretDown } from 'react-icons/ai';
import { Link, useHistory } from 'react-router-dom';
import { useAxios } from '../hooks/axiosHook';
import { RealmContext } from '../context/RealmContext';

function HeaderWrapper({ children, pageTitle, realms, handleSelect }) {
  const { getRequest } = useAxios();
  const history = useHistory();
  const [selectedRealm] = useContext(RealmContext);

  const handleLogout = () => {
    const res = getRequest('/logout');
    if (res) {
      history.push('/login');
    }
  };
  return (
    <Box bg='gray.50' minH='100vh' h='100%'>
      <Flex
        h='16'
        bg='blue.50'
        boxShadow='md'
        borderBottom='1px solid'
        borderColor='gray.200'
        justifyContent='space-between'
        alignItems='center'
        px='4'
      >
        <Heading color='twitter.500'>
          <Link to='/'>{pageTitle}</Link>
        </Heading>
        <Box>
          {realms && (
            <Menu>
              <MenuButton
                as={Button}
                colorScheme='twitter'
                variant='solid'
                mx='4'
                rightIcon={<AiFillCaretDown />}
              >
                Realm : {selectedRealm && selectedRealm.id}
              </MenuButton>
              <MenuList>
                {realms &&
                  realms.map((r) => (
                    <MenuItem onClick={() => handleSelect(r)} key={r}>
                      {r}
                    </MenuItem>
                  ))}
              </MenuList>
            </Menu>
          )}
          <Button
            colorScheme='twitter'
            variant='link'
            mx='4'
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Flex>
      <Box py='8' px='4' maxW='1920px' mx='auto' pb='10'>
        {children}
      </Box>
    </Box>
  );
}

export default HeaderWrapper;
