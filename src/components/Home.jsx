import { Box, Button, CircularProgress, Divider, SimpleGrid } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Await, Link } from "react-router-dom";
import {
    Center,
    useColorModeValue,
    Heading,
    Text,
    Stack,
    Image,
} from '@chakra-ui/react';

const getLocalItmes = () => {
    let list = localStorage.getItem('lists');
    if (list) {
        return JSON.parse(localStorage.getItem('lists'));
    } else {
        return [];
    }
}

//  require('dotenv').config()
const Home = () => {
   
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [category, setCategory] = useState([])
    const color = useColorModeValue('white', 'gray.800')
    const [select, setSelect] = useState("");
    const [item, setItem] = useState(getLocalItmes())
    const [search, setSearch] = useState("");
 
    console.log(process.env.TOKEN)
    useEffect(() => {
        setLoading(true)
        AllCategory();
        AllProduct(search);
       
    }, [search])



    const AllProduct = (search) => {
        axios.get("https://upayments-studycase-api.herokuapp.com/api/products",{headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZ2cmF1dDAxMEBnbWFpbC5jb20iLCJnaXRodWIiOiJodHRwczovL2dpdGh1Yi5jb20vMTVWSUtSQU5UIiwiaWF0IjoxNjY0MDkwOTM0LCJleHAiOjE2NjQ1MjI5MzR9.K1V3BWDZWYjL0qAB9sRBMzqKbdUaiYPQH1ZRJF4D134"}})
            .then((response) => {
                var array = response.data.products;
                var array = array.filter((e) =>
                    e.category.toLowerCase().includes(search.toLowerCase()))
                setLoading(false)
                setData(array)
            })
            .catch((e) => {
                console.log(e.message);
            })
    }

    console.log("ketan", data);

    const AllCategory = () => {
        axios.get(`https://upayments-studycase-api.herokuapp.com/api/categories/`, {headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZ2cmF1dDAxMEBnbWFpbC5jb20iLCJnaXRodWIiOiJodHRwczovL2dpdGh1Yi5jb20vMTVWSUtSQU5UIiwiaWF0IjoxNjY0MDkwOTM0LCJleHAiOjE2NjQ1MjI5MzR9.K1V3BWDZWYjL0qAB9sRBMzqKbdUaiYPQH1ZRJF4D134"}})
            .then((r) => {
                setCategory(r.data.categories)
            }).catch((e) => {
                console.log(e);
            })
    }

    const selectCategory = async (e) => {
        setSearch(e)
    }

    const AddFavorite = (e) => {
        setItem([...item, e])
        alert("Item is added to Favorite")
    }

    useEffect(() => {
        localStorage.setItem('lists', JSON.stringify(item))
    }, [item]);

    return (
        <div>
           
            <Box mt={"10px"} marginBottom={"10px"}>
                <SimpleGrid columns={[2, null, 5]} spacing='40px'>
                    {category?.map((e) =>
                        <Button
                            marginLeft="5px"
                            size='md'
                            height='38px'
                            width='150px'
                            border='2px'
                            borderColor="black"
                            onClick={() => selectCategory(e.name)}
                        >
                            {e.name}
                        </Button>
                    )}
                </SimpleGrid>
            </Box>
            {loading ?
                <Box marginLeft={"50%"} marginTop={"10%"}>
                    <CircularProgress isIndeterminate color='green.300' />
                </Box> :
                <Box>
                    <Box bg={"rgb(232,232,227)"} w='100%' p={4} color='white'>
                        <SimpleGrid columns={[2, null, 3]} spacing='40px'>
                            {data?.map((e) =>
                                <Box key={e._id}>
                                    <Box  >
                                        <Center py={12}>
                                            <Box
                                                role={'group'}
                                                p={6}
                                                maxW={'330px'}
                                                w={'full'}
                                                bg={color}
                                                boxShadow={'2xl'}
                                                rounded={'lg'}
                                                pos={'relative'}
                                                zIndex={1}>
                                                <Box
                                                    rounded={'lg'}
                                                    mt={-12}
                                                    pos={'relative'}
                                                    height={'230px'}
                                                    _after={{
                                                        transition: 'all .3s ease',
                                                        content: '""',
                                                        w: 'full',
                                                        h: 'full',
                                                        pos: 'absolute',
                                                        top: 5,
                                                        left: 0,
                                                        backgroundImage: `url(${e.avatar})`,
                                                        filter: 'blur(10px)',
                                                        zIndex: -1,
                                                    }}
                                                    _groupHover={{
                                                        _after: {
                                                            filter: 'blur(10px)',
                                                        },
                                                    }}>
                                                    <Link to={`product/${e._id}`}>
                                                        <Image
                                                            rounded={'lg'}
                                                            height={220}
                                                            width={282}
                                                            padding={10}
                                                            objectFit={'cover'}
                                                            src={e.avatar}
                                                        />
                                                    </Link>
                                                </Box>
                                                <Stack pt={10} align={'center'}>
                                                    <Text color={'gray.500'} fontSize={'sm'} textTransform={'uppercase'}>
                                                        {e.category}
                                                    </Text>
                                                    <Heading color={"black"} fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
                                                        <Link to={`product/${e._id}`}>
                                                            {e.name}
                                                        </Link>
                                                    </Heading>
                                                    <Heading color={"black"} fontSize={'xl'} fontFamily={'body'} fontWeight={500} noOfLines={1}>
                                                        <Link to={`product/${e._id}`}>
                                                            {e.description}
                                                        </Link>
                                                    </Heading>
                                                    <Stack direction={'row'} align={'center'}>
                                                        <Text textDecoration={'line-through'} color={'gray.600'}>
                                                            ${e.price + 98}
                                                        </Text>
                                                        <Text color={'gray.600'}>
                                                            ${e.price}
                                                        </Text>
                                                    </Stack>
                                                    <Box display={"flex"} gap="10px">
                                                        <Button color={"black"} onClick={() => AddFavorite(e)}>Add Favorite</Button>
                                                        <Button color={"black"} onClick={() => AddFavorite(e)}>Delete</Button>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Center>
                                    </Box>
                                </Box>
                            )}
                        </SimpleGrid>
                    </Box>
                </Box>
            }
        </div>
    )
}

export default Home
