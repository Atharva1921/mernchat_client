import React, { useEffect, useState } from 'react'
import Conversation from './Conversation'
import {Input, VStack, Text, InputRightElement, InputGroup, Button, Box, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerHeader, DrawerCloseButton, DrawerBody, Flex, Link, useToast} from '@chakra-ui/react'
import {useContext} from "react"
import conversationContext from '../../../Context/conversationContext'
import SearchResults from './SearchResults'
import axios from 'axios'
import clickContext from "../../../Context/clickContext"
import { BiSearchAlt2 } from 'react-icons/bi'
import { Icon } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import currentChatContext from '../../../Context/currentChatContext'




const Sidebar = () => {
   
    
    const userConversations = useContext(conversationContext)
    const [searchArray, setSearchArray] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [key, setKey] = useState('');
    const {click,setClick} = useContext(clickContext);
    const navigate = useNavigate();
    const {currentChat} = useContext(currentChatContext);
    const toast = useToast();


    let conversationArray

    if(userConversations.length !== 0) {
    conversationArray = userConversations
    }

    
    const searchHandle = async (event) =>{
      setKey(event.target.value);
    };

    const searchUsers = async () => {
      try {
        if(key){
        const res = await axios.get('/api/user/search/'+key);
        setSearchArray(res.data);
      } else if (key === '') {
        setSearchArray([]);
      }
      
      } catch (error) {
        console.log(error);
      }
    }

    useEffect(() => {
      searchUsers();
    }, [key])

    const SearchContainer = ({sArray,iKey}) => {
      if (sArray.length !== 0 && iKey)
      return sArray.map((s) => <SearchResults sr={s} key={s._id}/>);
      else if (sArray.length === 0 && iKey)
      return <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}> <Text fontSize='4xl'> No User Found </Text> </Flex>
      else
      return <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}> <Text fontSize='4xl'> Search User </Text> </Flex>
    }

    useEffect(() => {
      if(click === true) {
        onClose();
        setClick(false)
      }
    }, [click])

    const handleLogout = async () => {
      try {
        const res = await axios.get('/api/user/logout',{ withCredentials: true });
        if(res.status === 200) {
          toast({
            title: res.data.message,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          navigate('/login');
        }
        
      } catch (error) {
        console.log(error)
      }
    }
    

  return (
    <VStack bgColor={"whitesmoke"} height={"100%"} width={{base:'100%',md:'100%',lg:'30%'}} padding={"15px"} borderRadius={"3xl"} display={{base: currentChat? 'none':'flex',lg:'flex'}}>
    <VStack height={"20%"} width={"100%"} justifyContent={'center'}>
      
      <Button size={{base:'md',sm:'lg'}}  borderRadius={"full"} bgColor={"teal.400"} onClick={onOpen} width={"100%"}>
        Search
      </Button>

      <Text fontSize={{base:'3xl',sm:'4xl'}}>
        CHATS
      </Text>

    </VStack>
    
    <Box height={"75%"} width={"100%"} padding={"15px"} bgColor={"whitesmoke"} border={"2px"} borderColor={"teal.400"} borderRadius={"3xl"}>
    <Box height={"100%"} width={"100%"} overflowY={"auto"} sx={{
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
      {userConversations.length === 0 ? <Flex justifyContent={"center"} alignItems={"center"} height={"100%"}> <Text fontSize={{base:'3xl',sm:'4xl',md:'3xl'}}> Add a friend </Text> </Flex> : conversationArray.map( (c,i) => <Conversation conversation={c} key={i}/>)}
    </Box>
    </Box>

    <Link color='teal.400' onClick={handleLogout}> Logout </Link>
    

    <Drawer placement='top' onClose={onClose} isOpen={isOpen} size={'full'}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerCloseButton/>
        <DrawerHeader>
        </DrawerHeader>
          <DrawerBody>
          <VStack bgColor={"whitesmoke"} height={"100%"} width={"100%"} padding={"25px"} borderRadius={"3xl"} >
            <InputGroup>
              <Input
                placeholder={'Search user by email'}
                size="md"
                type="search"
                borderColor={"teal.400"}
                borderRadius={"full"}
                onChange={searchHandle}
              />
              <InputRightElement width='4rem' >
                <Icon boxSize={5} color='teal.400' as={BiSearchAlt2}/>
              </InputRightElement>
            </InputGroup>
          
          <Box height={"90%"} width={"100%"} padding={"15px"} bgColor={"whitesmoke"}>
          <Box height={"100%"} width={"100%"} overflowY={"auto"} sx={{
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

              <SearchContainer sArray={searchArray} iKey={key}/>

          </Box>
          </Box>
          </VStack>
          </DrawerBody>
      </DrawerContent>
    </Drawer>

  </VStack>
  
  )
}

export default Sidebar