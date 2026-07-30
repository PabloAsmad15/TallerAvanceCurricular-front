import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
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
    <Box
      minH="100vh"
      w="100vw"
      bg="linear-gradient(180deg, #002855 0%, #001838 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      py={8}
    >
      <VStack spacing={6} maxW="440px" w="100%" align="center">
        {/* Icono superior circular */}
        <Flex
          w={16}
          h={16}
          bg="white"
          borderRadius="full"
          align="center"
          justify="center"
          boxShadow="lg"
        >
          <Icon as={FiLogIn} w={8} h={8} color="#002855" />
        </Flex>

        {/* Encabezados */}
        <VStack spacing={1} textAlign="center">
          <Heading color="white" size="lg" fontWeight="bold" letterSpacing="tight">
            Sistema de Recomendación Curricular
          </Heading>
          <Text color="whiteAlpha.800" fontSize="sm">
            Universidad Privada Antenor Orrego
          </Text>
        </VStack>

        {/* Tarjeta de Formulario */}
        <Box
          bg="white"
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          w="100%"
          boxShadow="2xl"
        >
          <Heading size="md" color="gray.800" mb={6} fontWeight="bold">
            Iniciar Sesión
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email" isRequired>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  Correo Institucional
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" h="100%">
                    <Icon as={FiMail} color="gray.400" w={5} h={5} />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="pasmadm1@upao.edu.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bg="#edf2f7"
                    border="none"
                    borderRadius="lg"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.400' }}
                    _focus={{ bg: 'white', border: '1px solid #002855', boxShadow: 'none' }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  Contraseña
                </FormLabel>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" h="100%">
                    <Icon as={FiLock} color="gray.400" w={5} h={5} />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bg="#edf2f7"
                    border="none"
                    borderRadius="lg"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.400' }}
                    _focus={{ bg: 'white', border: '1px solid #002855', boxShadow: 'none' }}
                  />
                </InputGroup>
              </FormControl>

              <Flex justify="flex-end" pt={1}>
                <Link
                  as={RouterLink}
                  to="/password-recovery"
                  color="#004080"
                  fontSize="xs"
                  fontWeight="600"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </Flex>

              <Button
                type="submit"
                bg="#002855"
                color="white"
                size="lg"
                fontSize="sm"
                fontWeight="bold"
                borderRadius="lg"
                isLoading={isLoading}
                mt={2}
                _hover={{ bg: '#001a38', transform: 'translateY(-1px)' }}
                _active={{ bg: '#001024' }}
              >
                Iniciar Sesión
              </Button>

              <Text textAlign="center" fontSize="xs" color="gray.600" pt={2}>
                ¿No tienes cuenta?{' '}
                <Link as={RouterLink} to="/register" color="#004080" fontWeight="bold">
                  Regístrate aquí
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default LoginPage;