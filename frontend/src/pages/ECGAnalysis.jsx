import { Box, VStack, Heading, Button } from '@chakra-ui/react';

export default function ECGAnalysis() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="teal.600">
          📊 Анализ ЭКГ
        </Heading>
        <Button colorScheme="teal">
          Загрузить ЭКГ
        </Button>
        <p>Анализ пока в разработке</p>
      </VStack>
    </Box>
  );
}
