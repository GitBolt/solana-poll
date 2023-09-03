import { Flex, Text } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { useEffect, useState } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { useRouter } from 'next/router'
import { getPoll } from '@/util/program/getPoll'
import { getUser } from '@/util/program/getPollUser'
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { createPollUser } from '@/util/program/createPollUser'
import { DEVNET_RPC } from '@/util/constants'
import { answerPoll } from '@/util/program/answerPoll'


export default function Home() {

    const wallet = useAnchorWallet()
    const router = useRouter()
    const [data, setData] = useState<any>()
    const [resultsSoFar, setResultsSoFar] = useState<number[]>([])
    const [reload, setReload] = useState<number>(0)
    const [alreadyAnswered, setAlreadyAnswered] = useState<number>(0);


    useEffect(() => {

        const fetchData = async () => {
            const res = await getPoll(wallet as NodeWallet, Number(router.query.id))
            console.log(res.sig)
            if (!res.error && res.sig) {
                setData(res.sig)
                setResultsSoFar(res.sig.account.selectedOptions)
            }

            if (!wallet) return

            const res2 = await getUser(wallet as NodeWallet, Number(router.query.id), wallet?.publicKey)
            if (res2.sig) {
                console.log("User Poll Account: ", res2.sig)
                setAlreadyAnswered(res2.sig.account.selectedOption)
            }
        }
        fetchData()
    }, [reload])


    const handleClick = async (index: number) => {
        if (!wallet) return

        const connection = new Connection(DEVNET_RPC)
        const transaction = new Transaction()

        const data = await getUser(wallet as NodeWallet, Number(router.query.id), wallet.publicKey)
        console.log("Poll User: ", data)

        if (!data.sig) {
            console.log("Creating poll user account")
            const res = await createPollUser(wallet as NodeWallet, Number(router.query.id))
            console.log(res)
            if (!res.sig) return
            transaction.add(res.sig)
        }

        const res2 = await answerPoll(wallet as NodeWallet, Number(router.query.id), index)
        if (!res2.sig) return
        transaction.add(res2.sig)

        const { blockhash } = await connection.getLatestBlockhash()
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = wallet.publicKey

        const signedTx = await wallet.signTransaction(transaction)

        const finalRes = await connection.sendRawTransaction(signedTx.serialize())
        console.log(finalRes)
        setResultsSoFar((await getPoll(wallet as NodeWallet, Number(router.query.id))).sig?.account.selectedOptions as number[])
        setReload(+new Date())
    }

    return (
        <>

            <Navbar />

            <Flex flexFlow="column" gap="1rem" bg="#05070D" align="center" minH="100vh" h="100%" p="0 10rem">


                {data && data.account && <Text fontSize="3rem" color="white">{data.account.title}</Text>}

                {data && data.account.options.map((op: any, index: number) => {
                    const voteCount = resultsSoFar[index];
                    let sum = resultsSoFar.reduce((partialSum, a) => partialSum + a, 0);
                    let percentage;
                    if (sum === 0) {
                        percentage = 0.00;
                    } else {
                        percentage = ((voteCount / sum) * 100).toFixed(2);
                    }

                    return (
                        <Flex
                            onClick={alreadyAnswered ? () => { } : () => handleClick(index)}
                            cursor={alreadyAnswered ? "default" : "pointer"}
                            justify="space-between"
                            key={op}
                            bg={index == alreadyAnswered-1 ? "#4d5082" : "gray.800"}
                            fontSize="1.5rem"
                            color="white"
                            borderRadius="1rem"
                            w="70%"
                            h="5rem"
                            position="relative"
                        >
                            <div style={{ padding: '10px' }}>
                                {op}
                            </div>
                            <div style={{ padding: '10px' }}>
                                {`${voteCount} votes (${percentage}%)`}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: `${percentage}%`,
                                    backgroundColor: '#5f6673',
                                    opacity: 0.5,
                                    borderRadius: '1rem'
                                }}
                            ></div>
                        </Flex>
                    );
                })}

            </Flex>


        </>
    )
}
