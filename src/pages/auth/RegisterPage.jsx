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
  FormHelperText,
  Flex,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiUserPlus, FiMail, FiLock, FiUser, FiHash } from 'react-icons/fi';
import authService from '../../services/authService';

const RegisterPage = () => {
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
    
    if (!studentId.trim() || !firstName.trim() || !lastName.trim()) {
      toast({
        title: 'Error de registro',
        description: 'Por favor completa tu ID, Nombre y Apellido.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: 'Error de registro',
        description: 'Debes usar tu correo institucional @upao.edu.pe',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
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
        position: 'top-right',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Registrar en Firebase Auth (y pasar metadatos si fuera necesario en el futuro)
      await authService.register(email, password);
      
      toast({
        title: '¡Registro exitoso!',
        description: `Bienvenido(a) ${firstName}. Ya puedes iniciar sesión con tu cuenta.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error de registro',
        description: error.response?.data?.detail || 'Ocurrió un error inesperado',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
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
      <VStack spacing={6} maxW="480px" w="100%" align="center">
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
          <Icon as={FiUserPlus} w={8} h={8} color="#002855" />
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
            Crear Cuenta de Estudiante
          </Heading>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              
              <FormControl id="studentId" isRequired>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  ID de Estudiante (Código)
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none" h="100%">
                    <Icon as={FiHash} color="gray.400" w={4} h={4} />
                  </InputLeftElement>
                  <Input
                    placeholder="Ej: 000123456"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    bg="#edf2f7"
                    border="none"
                    borderRadius="lg"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.400' }}
                    _focus={{ bg: 'white', border: '1px solid #002855', boxShadow: 'none' }}
                  />
                </InputGroup>
              </FormControl>

              <SimpleGrid columns={2} spacing={3}>
                <FormControl id="firstName" isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                    Nombre
                  </FormLabel>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none" h="100%">
                      <Icon as={FiUser} color="gray.400" w={4} h={4} />
                    </InputLeftElement>
                    <Input
                      placeholder="Juan"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      bg="#edf2f7"
                      border="none"
                      borderRadius="lg"
                      fontSize="sm"
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{ bg: 'white', border: '1px solid #002855', boxShadow: 'none' }}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl id="lastName" isRequired>
                  <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                    Apellido
                  </FormLabel>
                  <InputGroup size="md">
                    <InputLeftElement pointerEvents="none" h="100%">
                      <Icon as={FiUser} color="gray.400" w={4} h={4} />
                    </InputLeftElement>
                    <Input
                      placeholder="Pérez"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      bg="#edf2f7"
                      border="none"
                      borderRadius="lg"
                      fontSize="sm"
                      _placeholder={{ color: 'gray.400' }}
                      _focus={{ bg: 'white', border: '1px solid #002855', boxShadow: 'none' }}
                    />
                  </InputGroup>
                </FormControl>
              </SimpleGrid>

              <FormControl id="email" isRequired>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  Correo Institucional (@upao.edu.pe)
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none" h="100%">
                    <Icon as={FiMail} color="gray.400" w={4} h={4} />
                  </InputLeftElement>
                  <Input
                    type="email"
                    placeholder="usuario@upao.edu.pe"
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
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none" h="100%">
                    <Icon as={FiLock} color="gray.400" w={4} h={4} />
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

              <FormControl id="confirmPassword" isRequired>
                <FormLabel fontSize="xs" fontWeight="600" color="gray.600" mb={1}>
                  Confirmar Contraseña
                </FormLabel>
                <InputGroup size="md">
                  <InputLeftElement pointerEvents="none" h="100%">
                    <Icon as={FiLock} color="gray.400" w={4} h={4} />
                  </InputLeftElement>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    bg="#edf2f7"
                    border="none"
                    borderRadius="lg"
                    fontSize="sm"
                    _placeholder={{ color: 'gray.400' }}
                    _focus={{ bg: 'white', border: '1px solid #002855', boxShadow: 'none' }}
                  />
                </InputGroup>
              </FormControl>

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
                Registrarse
              </Button>

              <Text textAlign="center" fontSize="xs" color="gray.600" pt={2}>
                ¿Ya tienes una cuenta?{' '}
                <Link as={RouterLink} to="/login" color="#004080" fontWeight="bold">
                  Inicia sesión aquí
                </Link>
              </Text>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
};

export default RegisterPage;