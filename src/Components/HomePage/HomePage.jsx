import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Container, HStack, Spinner, useToast} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import Chat from './Chat/Chat';
import Sidebar from './Sidebar/Sidebar';
import {userContext} from '../../Context/userContext';
import conversationContext from '../../Context/conversationContext'
import currentChatContext from "../../Context/currentChatContext"
import socketContext from "../../Context/socketContext"
import arrivalMessageContext from "../../Context/arrivalMessageContext"
import onlineUsersContext from "../../Context/onlineUsersContext"
import clickContext from '../../Context/clickContext';

import { io } from "socket.io-client";

const HomePage = () => {

  const toast = useToast();
  const navigate = useNavigate();
 
  const [userData, setUserData] = useState("");
  const [conversations, setConversations] = useState();
  const [currentChat, setCurrentChat] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = io("/");
  const [onlineUsers, setOnlineUsers] = useState();
  const [click, setClick] = useState(false);


  
  //get user data with axios and call home page
  const callHomePage =  async () => {
    try {
      const res = await axios.get('/api/user/home',{ withCredentials: true })
      const data = res.data
      setUserData(data) // set state is async it takes time rest code executes first.
    
    } catch (error) {
      const errorMessage = error.response.data.message //get message from error object
      toast({
        title: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      navigate('/login');
      console.log(error);
    }
  };


  //get user conversations
  const getConversations = async () => {
    try {
      if(userData){
        const res = await axios.get("/api/conversations/" + userData._id);
        setConversations(res.data)
        
      }
      
    } catch (error) {
      console.log(error);
    }
    
  };


  useEffect(() => {
    callHomePage();
  }, [])

  useEffect(() => {
    getConversations();
  }, [userData,click])

  useEffect(() => {
    if(userData) {
      
  
      socket.emit('addUser', userData._id);

      socket.on('users', users => {
        setOnlineUsers(users);
      })

      socket.on('getMessage', (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    }
  }, [userData])
  


  return (
  
    <clickContext.Provider value={{click,setClick}}>
    <onlineUsersContext.Provider value={onlineUsers}>
    <arrivalMessageContext.Provider value={arrivalMessage}>
    <socketContext.Provider value={socket}>
    <currentChatContext.Provider value={{currentChat,setCurrentChat}}>
    <conversationContext.Provider value={conversations}>
    <userContext.Provider value={userData}>
      <Container height={"100vh"} maxWidth={"100%"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <HStack border={"2px"} borderColor={"blackAlpha.400"} height={"90%"} width={"90%"} padding={"15px"} bgColor={"teal.400"}>
          {userData && conversations ? <Sidebar/> : <Spinner
          thickness='4px'
          speed='0.65s'
          emptyColor='gray.200'
          color='teal.400'
          size='xl'
        />}

          <Chat/>
        </HStack>
      </Container>
    </userContext.Provider>
    </conversationContext.Provider>
    </currentChatContext.Provider>
    </socketContext.Provider>
    </arrivalMessageContext.Provider>
    </onlineUsersContext.Provider>
    </clickContext.Provider>

  )
}

export default HomePage