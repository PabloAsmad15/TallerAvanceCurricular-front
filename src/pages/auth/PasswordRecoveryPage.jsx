import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Alert,
  AlertIcon,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiKey, FiMail } from 'react-icons/fi';
import authService from '../../services/authService';

const PasswordRecoveryPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (error) {
      toast({
        title: 'Error',
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
          <Icon as={FiKey} w={8} h={8} color="#002855" />
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
            Recuperar Contraseña
          </Heading>

          {isSuccess ? (
            <Alert status="success" borderRadius="lg">
              <AlertIcon />
              <Text fontSize="xs">
                Se ha enviado un correo con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada.
              </Text>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="xs" color="gray.600">
                  Ingresa tu correo institucional y te enviaremos las instrucciones para restablecer tu acceso.
                </Text>
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
                  Enviar Instrucciones
                </Button>
              </VStack>
            </form>
          )}

          <Text textAlign="center" fontSize="xs" color="gray.600" pt={4}>
            <Link as={RouterLink} to="/login" color="#004080" fontWeight="bold">
              Volver al inicio de sesión
            </Link>
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default PasswordRecoveryPage;