import { Box, Container, VStack, FormControl, FormLabel, FormHelperText, Input, Heading, Button, Text, Link } from '@chakra-ui/react'
import React from 'react'
import { useState } from 'react'
import Axios from "axios"
import asyncHandler from "express-async-handler"
import { useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';


const Register = () => {

    const [user, setUser] = useState({
        uname:"",
        email:"",
        password:"",
        confirmpassword:"",
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
        
        const {uname,email,password,confirmpassword} = user;

        try {

            const res = await Axios.post('/api/user/register',{
                name:uname,
                email,
                password,
                confirmpassword
            })

            if(res.status===200) {
                toast({
                    title: "Registered Succesfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                });
                navigate('/login');
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
                    SIGN UP
                </Heading>
                
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input type='text' placeholder='Name' value={user.uname} onChange={handleChange} name={"uname"} />
                </FormControl>

                <FormControl>
                    <FormLabel>Email address</FormLabel>
                    <Input type='email' placeholder='Email' value={user.email} onChange={handleChange} name={"email"} />
                </FormControl>

                <FormControl>
                    <FormLabel>Password</FormLabel>
                    <Input type='password' placeholder='Password' value={user.password} onChange={handleChange} name={"password"} />
                </FormControl>

                <FormControl>
                    <FormLabel>Confirm Password</FormLabel>
                    <Input type='password' placeholder='Confirm Password' value={user.confirmpassword} onChange={handleChange}  name={"confirmpassword"}/>
                </FormControl>

                <Button
                mt={4}
                backgroundColor={'teal.400'}
                type='submit'
                onClick={handleSubmit}
                >
                    Submit
                </Button>

                <Text>
                    Already have an account? <Link color='teal.400' onClick={() => navigate('/login')}>
                    login
                  </Link>
                </Text>

            </VStack>
    

    </Container>
  )
}

export default Register