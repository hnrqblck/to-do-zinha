import React from 'react';
import {
    Box,
    Checkbox,
    useDisclosure, 
    Heading, 
    Text,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { createTask, deleteTask, editTask, fetchTask, getProfile } from '../services/requestFunctions';
import { TaskModal } from '../components/TaskModal';

const Home = () => {
    const [tasks, setTasks] = React.useState([]);
    const accessToken = localStorage.getItem('token');
    const { isOpen: isEditTaskModalOpen, onOpen: onEditTaskModalOpen, onClose: onEditTaskModalClose } = useDisclosure();
    const { isOpen: isAddTaskModalOpen, onOpen: onAddTaskModalOpen, onClose: onAddTaskModalClose } = useDisclosure();

    React.useEffect(() => {
        updateTasks();
    }, [])

    function handleSave(value) {
        createTask(accessToken, value)
            .then(r => console.log(r));
        updateTasks();
    }

    function handleEdit(value) {
        editTask(accessToken, value, value.id)
            .then(r => console.log(r));
        updateTasks();
    }

    function updateTasks() {
        setTimeout(() => {
            fetchTask(accessToken)
                .then(({data}) => setTasks(data));
        }, 500);
        
    }

    function deleteSelectedTask(taskId) {
        deleteTask(accessToken, taskId)
            .then(r => console.log(r));
        updateTasks();
    }


  return (
    <>
        <Box display='flex' flexDir='column' justifyContent='center' alignItems='center' h='100vh'>
            <Heading mb='40px' color='#1A365D' textAlign='left'>To-do-zinha</Heading>
            <Box
                w='70vw' top={70} p='20px'
                textAlign='right' 
                position='relative'
            > 
                <AddIcon boxSize='2em' color='white' cursor='pointer' onClick={onAddTaskModalOpen}/>
            </Box>
            <Box
                w='70vw' h='60vh' bg='#1A365D' 
                borderRadius='15px'
                display='flex' 
                justifyContent='center' 
                alignItems='center'
                flexDir='column'
                >
                {tasks.length > 0 ? 
                    tasks.map(({title, id, description, status}) => (
                        <Box display='flex' alignItems='center'>
                            <Checkbox 
                                size={'lg'}
                                mb={5}
                                mr={5}
                                onChange={() => {
                                    const value = {
                                        title: title,
                                        description,
                                        id,
                                        status: status == 0 ? true : false,
                                    }
                                    handleEdit(value);
                                }}
                             />
                            <Box 
                                w='60vw' h='50px' mb='20px'
                                p='0 0 0 20px'
                                bg={status == 1 ? '#2D3748' : '#2B6CB0'}
                                borderRadius='5px' 

                                display='flex'
                                justifyContent='space-between'
                                alignItems='center'
                            >
                                <Text 
                                    key={id}
                                    color={status == 1 ? '#A0AEC0' : 'white'}
                                    fontSize='20px'
                                >
                                    {title}
                                </Text>
                                <Box>
                                    <EditIcon 
                                        boxSize='1.5em' 
                                        color={status == 1 ? '#A0AEC0' : 'white'}
                                        mr='10px'
                                        onClick={onEditTaskModalOpen}
                                        cursor='pointer'
                                    />
                                    <DeleteIcon
                                        boxSize='1.5em' 
                                        color={status == 1 ? '#A0AEC0' : 'white'}
                                        mr='10px' 
                                        onClick={() => deleteSelectedTask(id)}
                                        cursor='pointer'
                                    />
                                </Box>
                                <TaskModal 
                                    handleSave={handleEdit}
                                    isOpen={isEditTaskModalOpen} 
                                    onClose={onEditTaskModalClose} 
                                    headingTitle='Editar tarefa' 
                                    title={title} 
                                    description={description}
                                    id={id}
                                />
                            </Box>
                        </Box>

                    )) 
                : 
                (
                    <Text color='white' fontSize='2xl'>Você nao tem nenhuma tarefa, tente criar uma!</Text>
                )
                }

            </Box>
        </Box>
        <TaskModal handleSave={handleSave} isOpen={isAddTaskModalOpen} onClose={onAddTaskModalClose} headingTitle='Criar tarefa'/>
    </>

  )
};

export default Home;