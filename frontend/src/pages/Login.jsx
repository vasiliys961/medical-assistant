import { Box, Button, VStack, Heading, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post('/auth/login', {
        username,
        password
      });

      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.user_type === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (error) {
      alert('Ошибка входа: ' + (error.response?.data?.detail || 'Неверный логин или пароль'));
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" p={8} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6} maxW="md" w="full">
        <Heading as="h1" size="xl" color="teal.600">
          🏥 Медицинский ассистент
        </Heading>
        <Input
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="lg"
        />
        <Input
          placeholder="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="lg"
        />
        <Button colorScheme="teal" size="lg" w="full" onClick={handleLogin}>
          Войти
        </Button>
        <Text fontSize="sm" color="gray.500">
          Пример: логин — test, пароль — 123
        </Text>
      </VStack>
    </Box>
  );
}
