import { Avatar, AvatarBadge, Box, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, useToast } from '@chakra-ui/react'
import { useContext, useEffect, useState } from 'react'
import React from 'react'
import { userContext } from '../../../Context/userContext'
import axios from 'axios'
import currentChatContext from '../../../Context/currentChatContext';
import onlineUsersContext from '../../../Context/onlineUsersContext'
import { HamburgerIcon } from '@chakra-ui/icons'




const Conversation = ({conversation}) => {

    const {setCurrentChat} = useContext(currentChatContext)
    const onlineUsers = useContext(onlineUsersContext);
    const userData = useContext(userContext);
    const [friend, setFriend] = useState();
    const [color, setColor] = useState(false);
    const toast = useToast();
    

    //console.log(conversation)  //log conversation arrays & conversation contains arrays inside which there is members array which has both members
   
    

    const friendID = conversation.members.find(m => m !== userData._id)

    const getFriend = async () => {
        try {
            const res = await axios('http://localhost:5000/api/user/?userID=' + friendID);
            setFriend(res.data);
        } catch (error) {
            console.log(error);
        }
        

    };

    const friendOnline = () => {
        if (onlineUsers) {
            setColor(onlineUsers.some(user => user.userId === friendID)) 
        }
    }

    useEffect(() => {
        getFriend();
    }, [])

    useEffect(() => {
       friendOnline();
    }, [onlineUsers])

    const handleClearChat = async () => {
        try {
 
            const res = await axios.delete('/api/messages/' + conversation._id)
            if (res) {

                toast({
                    title: `deleted ${res.data.deletedCount} messages`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteChat = async () => {
        try {
         
            const cres = await axios.delete('/api/conversations/' + conversation._id)
            const mres = await axios.delete('/api/messages/' + conversation._id)
            if (cres && mres) {
                toast({
                    title: `deleted chat with  ${friend.name}`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    
    
  return (
    <>
    {friend ? 
        <HStack margin={"3px"}>
        <HStack display={"flex"} justifyContent={"flex-start"} border={"2px"} borderColor={"blackAlpha.200"} width={"90%"} borderRadius={"3xl"} padding={"5px"} marginRight={"0px"}
        onClick={() => setCurrentChat(conversation)}
        _hover={{background: "teal.400",color: "white",}}  >
            <Avatar name={friend.name}>
                <AvatarBadge boxSize='1.25em' bg={color ? 'green.600' : 'orange.500'} />
            </Avatar>
            <Text>
                {friend.name}
            </Text>
        </HStack>

        <Box width={"10%"}  display={"flex"} justifyContent={"center"} alignItems={"center"} padding={"1px"} overflow={"hidden"}>
            <Menu>
            <MenuButton as={IconButton}  icon={< HamburgerIcon />} boxSize={7} color='teal.500' backgroundColor={'whitesmoke'}  />
            <MenuList>
                <MenuItem onClick={handleClearChat} >
                Clear Chat
                </MenuItem>
                <MenuItem onClick={handleDeleteChat}>
                Delete Chat
                </MenuItem>
             
            </MenuList>
            </Menu>
        </Box>

        </HStack>
    : <Spinner/>}
    </>
  )
}

export default Conversation