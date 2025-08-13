import { Box, VStack, Heading } from '@chakra-ui/react';

export default function PatientDashboard() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="teal.600">
          🧑‍⚕️ Кабинет пациента
        </Heading>
        <p>Здесь будут ваши медицинские записи, анализы и рекомендации.</p>
      </VStack>
    </Box>
  );
}
