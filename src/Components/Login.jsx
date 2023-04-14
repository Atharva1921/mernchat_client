import React from 'react'
import { Box, Container, VStack, FormControl, FormLabel, FormHelperText, Input, Heading, Button, Text, Link } from '@chakra-ui/react'
import { useState } from 'react'
import Axios from "axios"
import asyncHandler from "express-async-handler"
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [user, setUser] = useState({
        email:"",
        password:"",
    });
    const toast = useToast();
    const navigate = useNavigate();

    let name , value
    const handleChange = (e) => {
        name = e.target.name
        value = e.target.value

        setUser({...user, [name]:value})

    }

    const handleSubmit = asyncHandler( async (e) => {
        
        const {email,password} = user;

        
        try {
            const res = await Axios.post('/api/user/login',{
                email,
                password
            },{ withCredentials: true })

            if(res.status===201) {
                
                toast({
                    title: res.data.message,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });

                const user = res.data.user
                navigate('/');
            }
        } catch (error) {
            const errorMessage = error.response.data.message

            toast({
                title: errorMessage,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
        }
       
    })

  return (
    <Container height={"100vh"} display={"flex"} alignItems={"center"} >
            <VStack display={"flex"} justifyContent={"center"} border={"2px"} borderColor={"blackAlpha.500"} p={"20px"} borderRadius={"5px"}  width={"100%"} spacing={"15px"}>
                <Heading>
                    LOGIN
                </Heading>

                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' placeholder='Email' value={user.email} onChange={handleChange} name={"email"} />
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' placeholder='Password' value={user.password} onChange={handleChange} name={"password"} />
                </FormControl>

                <Button
                mt={4}
                backgroundColor={'teal.400'}
                type='submit'
                onClick={handleSubmit}
                >
                    LOGIN
                </Button>

                <Text>
                    Do not have an account? <Link color='teal.400' onClick={() => navigate('/register')}>
                    Register
                  </Link>
                </Text>
            </VStack>
    

    </Container>
  )
}

export default Login;