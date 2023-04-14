import React, { useEffect, useRef, useState } from 'react'
import Message from './Message';
import {Input, VStack, InputRightElement, InputGroup, Button, Flex, Center, Box, Text, HStack, IconButton, Avatar, AvatarBadge } from '@chakra-ui/react'
import currentChatContext from '../../../Context/currentChatContext';
import { useContext } from 'react';
import axios from 'axios';
import { userContext } from '../../../Context/userContext';
import socketContext from "../../../Context/socketContext"
import arrivalMessageContext from '../../../Context/arrivalMessageContext';
import clickContext from '../../../Context/clickContext';
import friendContext from '../../../Context/friendContext';
import onlineUsersContext from '../../../Context/onlineUsersContext';
import { ArrowBackIcon } from '@chakra-ui/icons'

const Chat = () => {

  const {currentChat,setCurrentChat} = useContext(currentChatContext);
  const arrivalMessage = useContext(arrivalMessageContext);
  const socket = useContext(socketContext);
  const userData = useContext(userContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setnewMessage] = useState("");
  const messageEndRef = useRef('');
  const {click} = useContext(clickContext)
  const onlineUsers = useContext(onlineUsersContext);
  const [friendName, setFriendName] = useState("");
  const [chatColor, setChatColor] = useState(false)
  let friendID

  if(currentChat) {friendID = currentChat.members.find(m => m !== userData._id);};

  const getFriend = async () => {
    try {
      const res = await axios('http://localhost:5000/api/user/?userID=' + friendID);
      setFriendName(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if(currentChat) {
    getFriend();
    }
}, [currentChat])

const friendOnline = () => {
  if (onlineUsers) {
      setChatColor(onlineUsers.some(user => user.userId === friendID)) 
  }
}

useEffect(() => {
  friendOnline();
}, [onlineUsers,friendName])


  const getMessages = async () => {
    try {
      if(currentChat) {
      const res = await axios.get('/api/messages/' + currentChat._id);
      setMessages(res.data);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMessages()
}, [currentChat,click])


  useEffect(() => {
    messageEndRef.current?.scrollIntoView({behavior : "smooth"});
  }, [messages])


  const MessageContainer = ({Chat,array}) => {
    if (Chat && array.length !== 0)
    return array.map((m,i) => <Message key={i} message={m} own={m.sender === userData._id}/>)
    else if (Chat && array.length === 0 )
    return <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}> <Text fontSize={{base:'2xl',sm:'4xl',lg:'5xl'}}> Start Converstaion </Text> </Flex>
    else
    return <Flex justifyContent={"center"} alignItems={"center"} height={"100%"} > <Text fontSize={{base:'2xl',sm:'4xl',lg:'5xl'}}> Open Converstaion </Text> </Flex>
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendmessage = {
      conversationID : currentChat._id,
      sender : userData._id,
      text: newMessage,
    };

    

    if (onlineUsers.some(user => user.userId === currentChat.members.find(m => m !== userData._id))) {

      const receiverId = currentChat.members.find(m => m !== userData._id);
      socket.emit('sendMessage', {
        senderId:userData._id,
        receiverId,
        text: newMessage,
      })
    }

   
    
    try {
      const res = await axios.post('/api/messages/',sendmessage);
      setMessages([...messages,res.data]);
      setnewMessage("");
    } catch (error) {
      console.log(error)
    }
  };


  useEffect(() => {
    let currentSender;
    if(currentChat && arrivalMessage) {
      currentSender = currentChat.members.includes(arrivalMessage.sender);
    }
    
    if( (currentSender === true) && arrivalMessage) {
      setMessages((prev) => [...prev,arrivalMessage]);
    }

  }, [arrivalMessage,currentChat])


  
  return (
    <VStack bgColor={"whitesmoke"} height={"100%"} width={{base:'100%',md:'100%',lg:'70%'}} borderRadius={"3xl"} justifyContent={"flex-end"} padding={"15px"} alignItems={"flex-end"} display={{base: currentChat? 'flex':'none',lg:'flex'}}>
    
    <HStack display={{base: currentChat? 'flex':'none',lg:'none'}} height={"10%"} overflow={"hidden"} width={"100%"} justifyContent={"flex-start"}>
      <IconButton size={{base:'md',sm:'lg'}} backgroundColor={'whitesmoke'} borderRadius={"full"} icon={<ArrowBackIcon/>} onClick={() => setCurrentChat("")}/>
  
      <Avatar size={{base:'sm',sm:'md'}} name={friendName.name}>
                <AvatarBadge boxSize='1.25em' bg={chatColor ? 'green.600' : 'orange.500'} />
            </Avatar>
      <Text fontSize={"xl"}>
        {friendName.name}
      </Text>
    </HStack>
    
    <Flex overflowY={"auto"} height={"100%"} direction={"column"} width={"100%"} 
      sx={{
        '&::-webkit-scrollbar': {
          width: '10px',
          borderRadius: '8px',
          backgroundColor: `rgba(0, 0, 0, 0.05)`,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(56,	178,	172)',
          borderRadius: '8px',
        },
      }}>

      
      <MessageContainer Chat={currentChat} array={messages}/>
      <div ref={messageEndRef}/>

  
    </Flex>

     
    <InputGroup>
    <Input
      placeholder="Message"
      size="md"
      type="text"
      borderColor={"teal.400"}
      bgColor={"whitesmoke"}
      borderRadius={"full"}
      onChange={(e) => setnewMessage( e.target.value )}
      value={newMessage}
    />
    <InputRightElement width='7rem' padding={"5px"} >
      <Button size='lg'  borderRadius={"full"} margin={'2px'} bgColor={"teal.400"} height="100%" width='7rem' onClick={handleSubmit}>
        Send  
      </Button>
    </InputRightElement>
  </InputGroup>
    
  </VStack>
  )
}

export default Chat