import React from 'react';
import { authLogin, authRegister } from '../services/requestFunctions';
import { useForm, FormProvider } from "react-hook-form";
import {
    Box,
    Button,
    FormControl,
    Input,
    useDisclosure, 
    useToast,
    Heading, 
    Text,
    Link
} from '@chakra-ui/react'
import { RegisterModal } from '../components/RegisterModal';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm();

    const handleRegister = ({username}) => {
        console.log(username)
        authRegister(username)
        .then(response => {
            if(response.status === 201) {
                toast({
                    title: 'Cadastro realizado!',
                    description: 'Seu cadastro foi realizado com sucesso.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true.valueOf,
                })
            }
        })
    };

    const handleLogin = ({username}) => {
        console.log(username)
        authLogin(username)
        .then(response => {
            localStorage.setItem('token', response);
            navigate('/home')
        });
    };


  return (
    <>
    <Box display='flex' justifyContent='center' flexDir='column' alignItems='center' h='100vh' textAlign='center'>
        <Box bg='#F7FAFC' p='40px' borderRadius='15px' _hover={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 2px 0px' }} >
            <Heading mb='40px' color='#1A365D'>Login</Heading>
            <FormProvider >
                <form onSubmit={handleSubmit(handleLogin)}>
                    <FormControl id='register'>
                        <Input 
                            mb='20px'
                            id='username'
                            type='text'
                            placeholder='username'
                            {...register("username", {
                                required: "campo obrigatório *",
                            })}
                        />
                        <br/>
                        <Button
                            className='btn-login'
                            bg='#2B6CB0'
                            color='#ffff'
                            type='submit'
                            _hover={{
                                background: '#1A365D'
                            }}
                        >
                            Entrar
                        </Button>
                    </FormControl>
                </form>
            </FormProvider>
            <Text mt='20px'>Ainda não tem cadastro?&nbsp;
                <Link
                    onClick={onOpen}
                    color='#1A365D'
                >
                    Clique aqui para se cadastrar!
                </Link>
            </Text>

        </Box>
        <RegisterModal handleRegister={handleRegister} isOpen={isOpen} onClose={onClose}/>
    </Box>
    </>
  )
};

export default Login;

