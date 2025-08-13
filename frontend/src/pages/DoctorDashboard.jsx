import { Box, VStack, Heading, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function DoctorDashboard() {
  const navigate = useNavigate();

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="teal.600">
          👨‍⚕️ Кабинет врача
        </Heading>
        <Button colorScheme="teal" size="lg" onClick={() => navigate('/ecg')}>
          Анализ ЭКГ
        </Button>
        <Button colorScheme="blue" size="lg" onClick={() => navigate('/xray')}>
          Анализ рентгена
        </Button>
        <Button colorScheme="purple" size="lg" onClick={() => navigate('/chat')}>
          Чат с AI
        </Button>
      </VStack>
    </Box>
  );
}
