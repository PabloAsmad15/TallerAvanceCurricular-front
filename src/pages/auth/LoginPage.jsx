import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Heading,
  Text,
  Link,
  useToast,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiBookOpen } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import authService from '../../services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const setToken = useAuthStore((state) => state.setToken);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      setToken(data.access_token);

      const role = data.role || useAuthStore.getState().userRole;

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/app');
      }

      toast({
        title: '¡Bienvenido!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error de inicio de sesión',
        description: error.response?.data?.detail || 'Por favor verifica tus credenciales.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="md" py={{ base: 6, md: 12 }}>
      <VStack spacing={6} align="stretch">
        <VStack spacing={2} textAlign="center">
          <Flex
            w={12}
            h={12}
            bg="brand.500"
            color="white"
            borderRadius="xl"
            align="center"
            justify="center"
            boxShadow="md"
          >
            <Icon as={FiBookOpen} w={6} h={6} />
          </Flex>
          <Heading size="lg" color="gray.800">
            NatiGravity UPAO
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Plataforma Inteligente de Avance Curricular
          </Text>
        </VStack>

        <Box
          bg="white"
          p={{ base: 6, md: 8 }}
          borderRadius="xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              <FormControl id="email" isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Correo Electrónico
                </FormLabel>
                <Input
                  type="email"
                  placeholder="usuario@upao.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  size="lg"
                  fontSize="sm"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Contraseña
                </FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="lg"
                  fontSize="sm"
                />
              </FormControl>

              <Button
                type="submit"
                colorScheme="brand"
                width="100%"
                size="lg"
                fontSize="md"
                isLoading={isLoading}
                mt={2}
              >
                Ingresar
              </Button>
            </VStack>
          </form>
        </Box>

        <VStack spacing={2} textAlign="center" fontSize="sm">
          <Text color="gray.600">
            ¿No tienes una cuenta?{' '}
            <Link as={RouterLink} to="/register" color="brand.600" fontWeight="600">
              Regístrate aquí
            </Link>
          </Text>
          <Link as={RouterLink} to="/password-recovery" color="brand.500" fontSize="xs">
            ¿Olvidaste tu contraseña?
          </Link>
        </VStack>
      </VStack>
    </Container>
  );
};

export default LoginPage;