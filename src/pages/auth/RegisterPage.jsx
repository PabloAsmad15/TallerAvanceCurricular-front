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
  FormHelperText,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiUserPlus } from 'react-icons/fi';
import authService from '../../services/authService';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const validateEmail = (email) => {
    return email.endsWith('@upao.edu.pe') || email === 'pabloasmad15@gmail.com';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast({
        title: 'Error de registro',
        description: 'Debes usar tu correo institucional @upao.edu.pe',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Error de registro',
        description: 'Las contraseñas no coinciden.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(email, password);
      
      toast({
        title: '¡Registro exitoso!',
        description: 'Ya puedes iniciar sesión con tu cuenta.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error de registro',
        description: error.response?.data?.detail || 'Ocurrió un error inesperado',
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
            <Icon as={FiUserPlus} w={6} h={6} />
          </Flex>
          <Heading size="lg" color="gray.800">
            Crear Cuenta
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Regístrate para usar el Asesor Curricular UPAO
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
            <VStack spacing={4}>
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
                <FormHelperText fontSize="xs">
                  Debe ser correo institucional @upao.edu.pe
                </FormHelperText>
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

              <FormControl id="confirmPassword" isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Confirmar Contraseña
                </FormLabel>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                Registrarse
              </Button>
            </VStack>
          </form>
        </Box>

        <Text textAlign="center" fontSize="sm" color="gray.600">
          ¿Ya tienes una cuenta?{' '}
          <Link as={RouterLink} to="/login" color="brand.600" fontWeight="600">
            Inicia sesión aquí
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default RegisterPage;