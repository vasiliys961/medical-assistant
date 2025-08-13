import { Box, VStack, Heading, Input, Button, Text, Select } from '@chakra-ui/react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('patient');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const response = await API.post('/auth/register', {
        username,
        password,
        full_name: fullName,
        user_type: userType
      });
      alert('Регистрация успешна! Войдите в систему.');
      navigate('/');
    } catch (error) {
      alert('Ошибка: ' + (error.response?.data?.detail || 'Неизвестная ошибка'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" p={8} display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={6} maxW="md" w="full">
        <Heading as="h1" size="xl" color="teal.600">
          📝 Регистрация
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
        <Input
          placeholder="Полное имя"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          size="lg"
        />
        <Select value={userType} onChange={(e) => setUserType(e.target.value)}>
          <option value="patient">Пациент</option>
          <option value="doctor">Врач</option>
        </Select>
        <Button colorScheme="teal" size="lg" w="full" onClick={handleRegister} isLoading={loading}>
          Зарегистрироваться
        </Button>
        <Text fontSize="sm" color="gray.500">
          Уже есть аккаунт? <a href="/">Войти</a>
        </Text>
      </VStack>
    </Box>
  );
}

