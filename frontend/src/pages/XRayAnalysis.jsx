import { Box, VStack, Heading } from '@chakra-ui/react';

export default function XRayAnalysis() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="teal.600">
          🦴 Анализ рентгена
        </Heading>
        <p>Загрузите изображение рентгена для анализа.</p>
      </VStack>
    </Box>
  );
}
