import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { format} from 'timeago.js';

const Message = ({message,own}) => {
  return (
    <VStack alignSelf={own ? 'flex-end' : 'flex-start'} display={"flex"} justifyContent={"flex-start"} spacing={"1px"} border={"2px"} borderColor={"blackAlpha.200"} minWidth={"30%"} maxWidth={"60%"} borderRadius={"3xl"} padding={"5px"} paddingLeft={"20px"}
    paddingRight={"20px"} margin={"5px"}>
      <Text width={"100%"} fontSize='md'>
        {message.text}
      </Text>
      <Flex justifyContent={"flex-end"} maxH={"25%"} width={"100%"} >
        <Text fontSize='xs'>
          {format(message.createdAt)}
        </Text> 
      </Flex>
    </VStack>

  )
}

export default Message