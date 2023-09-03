import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { useRouter } from 'next/router'
import { CheckCircleIcon, EditIcon, ViewIcon } from '@chakra-ui/icons'
import { getPolls } from '@/util/program/getPolls'


export default function Home() {

    const wallet = useAnchorWallet()
    const router = useRouter()
    const [data, setData] = useState<any[]>([])

    useEffect(() => {

        const fetchData = async () => {
            const res = await getPolls(wallet as NodeWallet, true, true)
            console.log(res.sig)
            if (!res.error && res.sig) setData(res.sig)

        }
        fetchData()
    }, [])

    const handleViewPoll = (pollId: string) => {
        router.push(`/polls/${pollId}`);
    };

    const handleViewPolls = () => {
        router.push('/polls');
    };

    return (
        <>

            <Navbar />

            <Flex flexFlow="column" gap="1rem" bg="#05070D" align="center" minH="100vh" h="100%" p="0 10rem">
                <Flex justify="center" gap="2rem" align="center" mt="2rem">
                    <Text fontSize="2rem" color="white">Your Polls</Text>

                    <Button
                        leftIcon={<ViewIcon />}
                        colorScheme='telegram'
                        onClick={handleViewPolls}
                    >
                        View All Polls
                    </Button>
                </Flex>

                {data && data.length ? data.map((d) => (
                    <Flex
                        key={d.publicKey.toBase58()}
                        backgroundColor={d.account.isActive ? "gray.700" : "gray.800"}
                        borderRadius="1rem"
                        color="white"
                        padding="1rem"
                        fontSize="2rem"
                        align="center"
                        justify="space-between"
                        _hover={{ filter: "brightness(120%)" }}
                        w="60%"
                        cursor="pointer"
                        onClick={() => handleViewPoll(d.account.id)}
                    >
                        <Box>
                            <Text fontSize="1.5rem" fontWeight="bold">
                                {d.account.title}
                            </Text>
                            {d.account.isActive ? <Text fontSize="1rem" color="gray.400">
                                Poll Ending Date: {new Date(d.account.endingTimestamp.toNumber()).toLocaleDateString()}
                            </Text> : <Text fontSize="1.2rem" color="gray.300" fontWeight={600}>Poll has ended. Click to see results</Text>}
                            <Text fontSize="1rem" color="gray.400">
                                Users Participated: {d.account.selectedOptions.reduce((partialSum: number, a: any) => partialSum + a, 0)}
                            </Text>

                        </Box>
                        {!d.account.isActive && <CheckCircleIcon />}
                    </Flex>
                )) : <Text color="white" fontSize="2rem">No polls yet!</Text>}
            </Flex>


        </>
    )
}
