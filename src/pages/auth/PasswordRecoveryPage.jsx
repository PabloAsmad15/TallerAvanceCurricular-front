import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Alert,
  AlertIcon,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FiKey } from 'react-icons/fi';
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
            <Icon as={FiKey} w={6} h={6} />
          </Flex>
          <Heading size="lg" color="gray.800">
            Recuperar Contraseña
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Te enviaremos un enlace para restablecer tu cuenta
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
          {isSuccess ? (
            <Alert status="success" borderRadius="lg">
              <AlertIcon />
              <Text fontSize="sm">
                Se ha enviado un correo con instrucciones para restablecer tu contraseña. Revisa tu bandeja de entrada.
              </Text>
            </Alert>
          ) : (
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
                  Enviar Instrucciones
                </Button>
              </VStack>
            </form>
          )}
        </Box>
        
        <Text textAlign="center" fontSize="sm">
          <Link as={RouterLink} to="/login" color="brand.600" fontWeight="600">
            Volver al inicio de sesión
          </Link>
        </Text>
      </VStack>
    </Container>
  );
};

export default PasswordRecoveryPage;