import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import {Routes,Route} from 'react-router-dom'
import Register from './Components/Register';
import Login from './Components/Login';
import HomePage from './Components/HomePage/HomePage';



function App() {
  return (
    <ChakraProvider theme={theme}>

      <Routes>
      
      <Route path='/' element={<HomePage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>

      
      
      </Routes> 
    </ChakraProvider>
  );
}

export default App;
