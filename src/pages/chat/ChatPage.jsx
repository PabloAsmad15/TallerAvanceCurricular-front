import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Input,
  useToast,
  Flex,
  IconButton,
  Spinner,
  Heading,
  Text,
  Badge,
  HStack,
} from '@chakra-ui/react';
import { FiSend, FiCpu } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from '../../components/ChatMessage';
import FileUploader from '../../components/FileUploader';
import useChatStore from '../../store/chatStore';
import chatService from '../../services/chatService';

const MotionBox = motion(Box);

const ChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  const {
    messages,
    isReportUploaded,
    hasSentFirstEmail,
    isLoading,
    addMessage,
    setReportUploaded,
    setHasSentFirstEmail,
    setIsLoading,
  } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        content: "¡Hola! Soy tu Asesor Virtual UPAO. Por favor, sube tu reporte de notas (PDF o XML) para analizar tu avance curricular y ofrecerte recomendaciones personalizadas.",
        isBot: true,
      });
    }
  }, [addMessage, messages.length]);

  const handleFileUpload = async (file) => {
    setIsLoading(true);
    try {
      const response = await chatService.uploadReport(file);
      setReportUploaded(true);
      addMessage({
        content: response.message || "¡Perfecto! Ya analicé tu reporte académico. Puedes pedirme una 'Recomendación de cursos' o realizarme cualquier consulta sobre tu plan de estudios.",
        isBot: true,
      });
    } catch (error) {
      toast({
        title: 'Error al procesar el archivo',
        description: error.response?.data?.detail || 'No se pudo leer el archivo. Inténtalo nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecommendation = async (sendEmail = false) => {
    setIsLoading(true);
    try {
      const response = await chatService.getRecommendation(sendEmail);
      
      const cursosTexto = Array.isArray(response.recomendacion)
        ? response.recomendacion
            .map((c, i) => `${i + 1}. ${typeof c === 'object' ? `${c.codigo} - ${c.nombre} (${c.creditos} créditos)` : c}`)
            .join('\n')
        : response.recomendacion;

      const formattedRecommendation = `${response.explicacion}\n\n📚 Cursos Recomendados:\n${cursosTexto}`;

      addMessage({
        content: formattedRecommendation,
        isBot: true,
      });

      if (!hasSentFirstEmail) {
        setHasSentFirstEmail(true);
        addMessage({
          content: "✨ He enviado automáticamente esta primera recomendación a tu correo registrado. Si deseas reenviarla o enviar cualquier otra consulta a un correo distinto, puedes usar el botón 'Enviar por correo' debajo de cada mensaje.",
          isBot: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error al obtener recomendación',
        description: error.response?.data?.detail || 'Ocurrió un error al generar tu recomendación.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;

    const currentQuery = userInput;
    setUserInput('');

    addMessage({
      content: currentQuery,
      isBot: false,
    });

    const inputLower = currentQuery.toLowerCase();

    if (inputLower.includes('recomendación') || inputLower.includes('recomienda') || inputLower.includes('curso')) {
      if (!hasSentFirstEmail) {
        await handleRecommendation(true);
      } else {
        await handleRecommendation(false);
      }
    } else {
      setIsLoading(true);
      try {
        const response = await chatService.sendGeneralQuery(currentQuery);
        addMessage({
          content: response.respuesta,
          isBot: true,
        });
      } catch (error) {
        toast({
          title: 'Error al procesar tu consulta',
          description: error.response?.data?.detail || 'No pudimos procesar tu mensaje.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Container maxW="container.md" px={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }}>
      <VStack h="calc(100vh - 120px)" minH="500px" spacing={4} align="stretch">
        {/* Cabecera del Chat Animada */}
        <MotionBox
          bg="white"
          p={4}
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Flex w={10} h={10} bg="blue.50" borderRadius="xl" align="center" justify="center">
                <FiCpu size={22} color="#002855" />
              </Flex>
              <Box>
                <Heading size="sm" color="#002855" fontWeight="700">
                  Asesor Curricular IA (LangChain + 4 Solvers)
                </Heading>
                <Text fontSize="xs" color="gray.500" fontWeight="500">
                  Universidad Privada Antenor Orrego (UPAO)
                </Text>
              </Box>
            </HStack>
            <Badge colorScheme={isReportUploaded ? 'green' : 'orange'} borderRadius="full" px={3} py={1} fontSize="xs">
              {isReportUploaded ? '● Reporte Cargado' : '○ Pendiente Reporte'}
            </Badge>
          </Flex>
        </MotionBox>

        {/* Área de mensajes animada */}
        <Box
          flex={1}
          w="100%"
          overflowY="auto"
          p={{ base: 3, md: 5 }}
          bg="gray.50"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.200"
          shadow="inner"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                mb={3}
              >
                <ChatMessage
                  message={message}
                  isBot={message.isBot}
                />
              </MotionBox>
            ))}
          </AnimatePresence>
          {isLoading && (
            <Flex justify="center" p={4}>
              <Spinner size="md" color="#002855" thickness="3px" />
            </Flex>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Entrada de datos */}
        {!isReportUploaded ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <FileUploader onFileUpload={handleFileUpload} />
          </MotionBox>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Flex gap={2}>
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Pregunta sobre tus cursos o solicita recomendaciones..."
                disabled={isLoading}
                bg="white"
                size="lg"
                fontSize="sm"
                borderRadius="xl"
                shadow="sm"
                _focus={{ borderColor: '#002855', shadow: 'md' }}
              />
              <IconButton
                type="submit"
                icon={<FiSend />}
                colorScheme="blue"
                bg="#002855"
                size="lg"
                borderRadius="xl"
                isLoading={isLoading}
                aria-label="Enviar mensaje"
                _hover={{ bg: '#001d3d', scale: 1.05 }}
              />
            </Flex>
          </form>
        )}
      </VStack>
    </Container>
  );
};

export default ChatPage;