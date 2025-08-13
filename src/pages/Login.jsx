import { Box, Button, VStack, Heading } from '@chakra-ui/react'

export default function Login() {
  return (
    <Box minH="100vh" bg="gray.50" p={8} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6}>
        <Heading>🏥 Медицинский ассистент</Heading>
        <Button colorScheme="teal">Войти как врач</Button>
        <Button colorScheme="blue">Войти как пациент</Button>
      </VStack>
    </Box>
  )
}
