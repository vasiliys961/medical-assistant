import { Box, VStack, Heading } from '@chakra-ui/react';

export default function VoiceConsultation() {
  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="xl" color="teal.600">
          🎙️ Голосовая консультация
        </Heading>
        <p>Голосовой ввод пока в разработке.</p>
      </VStack>
    </Box>
  );
}
