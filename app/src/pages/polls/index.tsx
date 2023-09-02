import { Flex, Text } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { useRouter } from 'next/router'
import { EditIcon, ViewIcon } from '@chakra-ui/icons'
import { getPolls } from '@/util/program/getPolls'


export default function Home() {

    const wallet = useAnchorWallet()
    const router = useRouter()
    const [data, setData] = useState<any[]>([])

    useEffect(() => {

        const fetchData = async () => {
            const res = await getPolls(wallet as NodeWallet)
            console.log(res.sig)
            if (!res.error && res.sig) setData(res.sig)

        }
        fetchData()
    }, [])

    return (
        <>

            <Navbar />

            <Flex flexFlow="column" gap="1rem" bg="#05070D" align="center" minH="100vh" h="100%" p="0 10rem">

                {data.map((d) => (
                    <Flex onClick={() => router.push(`/polls/${d.account.id}`)} mt="1rem" key={d.publicKey.toBase58()} bg="gray.800" borderRadius="1rem" color="white" padding="1rem" fontSize="2rem" w="80%">
                        <Text>{d.account.title}</Text>
                    </Flex>
                ))}
            </Flex>


        </>
    )
}
