import { Box, VStack, HStack, Text, Input, Button } from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import API from '../services/api';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Здравствуйте! Я ваш медицинский ассистент. Чем могу помочь?' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const response = await API.post('/chat/message', { message: input });
      const aiMsg = { role: 'ai', content: response.data.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg = { role: 'ai', content: 'Извините, произошла ошибка при подключении к AI.' };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <Box bg="teal.600" color="white" p={4}>
        <Text fontSize="xl" fontWeight="bold">💬 Чат с медицинским ассистентом</Text>
      </Box>

      <Box flex="1" overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {messages.map((msg, i) => (
            <Box
              key={i}
              alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              bg={msg.role === 'user' ? 'teal.500' : 'gray.100'}
              color={msg.role === 'user' ? 'white' : 'black'}
              p={3}
              borderRadius="lg"
              maxW="80%"
            >
              <Text>{msg.content}</Text>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </VStack>
      </Box>

      <HStack p={4} borderTop="1px" borderColor="gray.200">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button colorScheme="teal" onClick={sendMessage}>
          Отправить
        </Button>
      </HStack>
    </Box>
  );
}
