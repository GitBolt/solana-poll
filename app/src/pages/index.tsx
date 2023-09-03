import { Button, Flex, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Text, useToast } from '@chakra-ui/react'
import { Navbar } from '@/components/Navbar'
import { useRouter } from 'next/router'
import { EditIcon, ViewIcon } from '@chakra-ui/icons'


export default function Home() {

  const router = useRouter()

  return (
    <>

      <Navbar />

      <Flex flexFlow="column" gap="1rem" bg="#05070D" align="center" minH="100vh" h="100%" p="0 10rem">

        <Text mt="40px" fontSize="40px" color="white" fontWeight={700}>Welcome to Online Solana Poll dApp</Text>
        <Text fontSize="30px" fontWeight={700} color="#64667B">Choose Either Of These Actions</Text>


        <Flex justify="space-around" w="100%">

          <Flex onClick={() => router.push("/polls")} flexFlow="column" _hover={{ bg: "gray.700" }} transition="200ms" cursor="pointer" borderRadius="1rem" fontSize="3rem" bg="gray.800" color="white" w="30rem" h="30rem" justify="center" align="center">
            View & Answer a Poll
            <ViewIcon />
          </Flex>

          <Flex onClick={() => router.push("/create")} flexFlow="column" _hover={{ bg: "gray.700" }} transition="200ms" cursor="pointer" borderRadius="1rem" fontSize="3rem" bg="gray.800" color="white" w="30rem" h="30rem" justify="center" align="center">
            Create a Poll
            <EditIcon />
          </Flex>
        </Flex>

      </Flex>


    </>
  )
}
