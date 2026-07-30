import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
  Icon,
  Box,
} from '@chakra-ui/react';
import { FiMail, FiSend } from 'react-icons/fi';
import chatService from '../services/chatService';
import useAuthStore from '../store/authStore';

const SendEmailModal = ({ isOpen, onClose, recommendationContent }) => {
  const userEmail = useAuthStore((state) => state.userEmail) || '';
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setRecipientEmail(userEmail);
    }
  }, [isOpen, userEmail]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!recipientEmail || !recipientEmail.includes('@')) {
      toast({
        title: 'Correo inválido',
        description: 'Por favor ingresa una dirección de correo electrónico válida.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);

    try {
      await chatService.sendEmail({
        to_email: recipientEmail,
        subject: 'Tu Recomendación Curricular - UPAO',
        content: recommendationContent,
      });

      toast({
        title: '¡Correo enviado con éxito!',
        description: `La recomendación ha sido enviada a ${recipientEmail}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Error al enviar el correo',
        description: error.response?.data?.detail || 'No se pudo enviar el correo en este momento.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(4px)" />
      <ModalContent borderRadius="xl" mx={4}>
        <form onSubmit={handleSend}>
          <ModalHeader display="flex" alignItems="center" gap={2} borderBottomWidth={1} borderColor="gray.100" pb={4}>
            <Icon as={FiMail} color="brand.500" w={5} h={5} />
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              Enviar Recomendación por Correo
            </Text>
          </ModalHeader>
          <ModalCloseButton top={4} />

          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color="gray.600">
                Se enviará el resumen de la recomendación académica generada por la IA a la dirección que especifiques.
              </Text>

              <FormControl id="email" isRequired>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">
                  Correo Electrónico Destino
                </FormLabel>
                <Input
                  type="email"
                  placeholder="ejemplo@upao.edu.pe"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </FormControl>

              <Box bg="gray.50" p={3} borderRadius="md" border="1px solid" borderColor="gray.200">
                <Text fontSize="xs" fontWeight="bold" color="gray.500" mb={1}>
                  VISTA PREVIA DEL CONTENIDO:
                </Text>
                <Text fontSize="xs" color="gray.700" noOfLines={3}>
                  {recommendationContent}
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth={1} borderColor="gray.100" pt={3} pb={4} gap={3}>
            <Button variant="ghost" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="brand"
              leftIcon={<FiSend />}
              isLoading={isLoading}
              loadingText="Enviando..."
            >
              Enviar Correo
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default SendEmailModal;
