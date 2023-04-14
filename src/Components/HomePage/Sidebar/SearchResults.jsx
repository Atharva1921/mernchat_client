import { Avatar, HStack, Text, Toast, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios';
import React, { useContext, useState } from 'react'
import clickContext from '../../../Context/clickContext';
import { userContext } from '../../../Context/userContext';





const SearchResults = (sr) => {

  const userData = useContext(userContext);
  const toast = useToast();
  const {setClick} = useContext(clickContext);


  const handleClick = async () => {
    try {
      const res = await axios.post('/api/conversations/search',{
        senderID: userData._id,
        receiverID: sr.sr._id,
      });

      if(res.data.length !== 0 ) {
        toast({
          title: `Chat with ${sr.sr.email} exists`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setClick(true);
      } else {
        const cres = await axios.post('/api/conversations/', {
          senderID: userData._id,
          receiverID: sr.sr._id,
        })
        toast({
          title: `Chat with ${sr.sr.email} created`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        setClick(true);
      }
    } catch (error) {
      
    }
  }
  

  return (
    <HStack display={"flex"} justifyContent={"flex-start"} border={"2px"} borderColor={"blackAlpha.200"} width={"95%"} borderRadius={"3xl"} padding={"5px"} 
    onClick={handleClick}
    _hover={{background: "teal.400",color: "white",}} margin={"5px"} 
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
        <Avatar name={sr.sr.name}>
        </Avatar>
        <Text>
            {sr.sr.email}
        </Text>
    </HStack>
  )
}

export default SearchResults