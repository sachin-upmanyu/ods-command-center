import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Router from './routes';
import { RealmProvider} from './context/RealmContext';

function App() {
  return (
    <ChakraProvider>
      <RealmProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </RealmProvider>
    </ChakraProvider>
  );
}

export default App;
