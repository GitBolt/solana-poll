import React, { useEffect, useState } from 'react';
import {
    Flex,
    Text,
    Box,
    Button,
    Spacer,
    IconButton,
    Stack,
} from '@chakra-ui/react';
import { EditIcon, ViewIcon } from '@chakra-ui/icons';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';
import { useRouter } from 'next/router';
import { getPolls } from '@/util/program/getPolls';
import { Navbar } from '@/components/Navbar';

export default function Home() {
    const wallet = useAnchorWallet();
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPolls(wallet as NodeWallet);
            console.log(res.sig);
            if (!res.error && res.sig) setData(res.sig);
        };
        fetchData();
    }, []);

    const handleViewPolls = () => {
        router.push('/polls/my');
    };

    const handleViewPoll = (pollId: string) => {
        router.push(`/polls/${pollId}`);
    };

    return (
        <>
            <Navbar />
            <Flex
                flexDirection="column"
                align="center"
                minHeight="100vh"
                padding="0 10rem"
                backgroundColor="#05070D"
            >
                    <Flex justify="center" gap="2rem" align="center" mt="2rem">
                        <Text fontSize="2rem" color="white">All Polls</Text>

                        <Button
                            leftIcon={<ViewIcon />}
                            colorScheme='telegram'
                            onClick={handleViewPolls}
                        >
                            View Your Polls
                        </Button>
                    </Flex>

                    <Stack spacing="1rem" marginTop="1rem" width="60%">
                        {data.map((d) => (
                            <Box
                            _hover={{filter:"brightness(120%)"}}
                                key={d.publicKey.toBase58()}
                                backgroundColor="gray.800"
                                borderRadius="1rem"
                                color="white"
                                padding="1rem"
                                fontSize="2rem"
                                
                                cursor="pointer"
                                onClick={() => handleViewPoll(d.account.id)}
                            >
                                <Text fontSize="1.5rem" fontWeight="bold">
                                    {d.account.title}
                                </Text>
                                <Text fontSize="1rem" color="gray.400">
                                    Poll Ending Date: {new Date(d.account.endingTimestamp.toNumber()).toLocaleDateString()}
                                </Text>
                                <Text fontSize="1rem" color="gray.400">
                                    Users Participated: {d.account.selectedOptions.reduce((partialSum: number, a: any) => partialSum + a, 0)}
                                </Text>
                            </Box>
                        ))}
                    </Stack>
            </Flex>
        </>
    );
}
