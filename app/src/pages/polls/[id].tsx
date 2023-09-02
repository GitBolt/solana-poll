import Head from 'next/head'
import { Button, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useToast } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { useState } from 'react'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet'
import { useRouter } from 'next/router'
import { EditIcon, ViewIcon } from '@chakra-ui/icons'


export default function Home() {

  const [name, setName] = useState<string>('')
  const [amount, setAmount] = useState<number>(0)
  const wallet = useAnchorWallet()
  const router = useRouter()
  const toast = useToast()



  return (
    <>

      <Navbar />



    <Flex>

        

    </Flex>


    </>
  )
}
