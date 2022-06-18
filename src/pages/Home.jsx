import React from 'react';
import {
    Box,
    Checkbox,
    useDisclosure, 
    Heading, 
    Text,
} from '@chakra-ui/react'
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { askBot, createTask, deleteTask, editTask, fetchTask, getProfile } from '../services/requestFunctions';
import { TaskModal } from '../components/TaskModal';

const ChatBox = () => {
    const [content, setContent] = React.useState([])
    const [ text, setText ] = React.useState()
    
    const OnKeyUp = (input) => {
        const key = input.key
        if(key === "Enter") {
            addContent(input.target.value)
            setText("")
        }
    }

    const addContent = async (userTextValue) => {
        const accessToken = localStorage.getItem('token');

        const botResponse = await askBot(accessToken, userTextValue)
        console.log(botResponse)
        
        setContent(oldContent => [...oldContent, `Me: ${userTextValue}`, botResponse.awsrer])
    }

    const ulStyle = {
        listStyle: "none",
        height: 350,
        overflow: "scroll",
        "overflow-x": "hidden"
    }

    const liStyle = {
        padding: 10,
        color: "white"
    }

    const inputStyle = {
        position: "absolute",
        bottom: 0,
        width: 300,
        padding: 5,
        background: "gray",
        color: "white",
        border: "solid black"
    }

    return (
        <div style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            background: "gray",
            width: 300,
            height: 400
        }}>
            <ul style={ulStyle}>
                {content && content.map(message => (
                <li key={message} style={liStyle}>
                    {message}
                </li>  
                ))}
            </ul>
            <input placeholder='Pergunte..' style={inputStyle} type="text" value={text} onChange={input => setText(input.target.value)} onKeyDown={OnKeyUp} />
        </div>
    )
}

const Home = () => {
    const [tasks, setTasks] = React.useState([]);
    const accessToken = localStorage.getItem('token');
    
    const { isOpen: isEditTaskModalOpen, onOpen: onEditTaskModalOpen, onClose: onEditTaskModalClose } = useDisclosure();
    const { isOpen: isAddTaskModalOpen, onOpen: onAddTaskModalOpen, onClose: onAddTaskModalClose } = useDisclosure();

    React.useEffect(() => {
        updateTasks();
    }, [])

    async function handleSave(value) {
        onAddTaskModalClose();
        await createTask(accessToken, value)
        await updateTasks();
    }

    async function handleEdit(value) {
        await editTask(accessToken, value, value.id)
        await updateTasks();
    }

    async function updateTasks() {
        console.log("EXECUTOU TASKS")
        const newTasks = await fetchTask(accessToken)
        setTasks(newTasks)
    }

    async function deleteSelectedTask(taskId) {
        await deleteTask(accessToken, taskId)
        await updateTasks();
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
                {tasks?.length > 0 ? 
                    tasks.map(({title, id, description, status}) => (
                        <Box display='flex' alignItems='center'>
                            <Checkbox 
                                size={'lg'}
                                mb={5}
                                isChecked={status == 1}
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
                                    handleSave={(newValues) => {
                                        onEditTaskModalClose();
                                        handleEdit({
                                            ...newValues,
                                            id, 
                                            status
                                        });
                                    }}
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
        <ChatBox />
    </>

  )
};

export default Home;