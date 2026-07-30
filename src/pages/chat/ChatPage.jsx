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
  Image,
  Button,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiSend, FiCpu, FiMessageSquare, FiBookOpen, FiCompass, FiZap } from 'react-icons/fi';
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
        content: "¡Hola! Soy tu Asesor Curricular Virtual UPAO. Sube tu reporte académico o realiza preguntas directas sobre tu avance, mallas o convalidaciones.",
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
        content: response.message || "¡Perfecto! Ya procesé tu historial de notas. Solicita una 'Recomendación de cursos' o consulta sobre equivalencias de la Malla 2025.",
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
            .map((c, i) => `${i + 1}. ${typeof c === 'object' ? `${c.codigo} - ${c.nombre} (${c.creditos} crd)` : c}`)
            .join('\n')
        : response.recomendacion;

      const formattedRecommendation = `${response.explicacion}\n\n📚 Recomendación de Cursos para Matrícula:\n${cursosTexto}`;

      addMessage({
        content: formattedRecommendation,
        isBot: true,
      });

      if (!hasSentFirstEmail) {
        setHasSentFirstEmail(true);
        addMessage({
          content: "✨ Se ha enviado automáticamente la constancia de recomendación a tu correo UPAO registrado. Puedes usar 'Enviar por correo' para reenviarla en cualquier momento.",
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

  const handleQuickPrompt = (promptText) => {
    setUserInput(promptText);
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
      await handleRecommendation(!hasSentFirstEmail);
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
    <Container maxW="container.lg" px={{ base: 2, md: 4 }} py={{ base: 2, md: 4 }}>
      <VStack h="calc(100vh - 110px)" minH="550px" spacing={4} align="stretch">
        {/* Header Minimalista Estilo Gemini / ChatGPT */}
        <MotionBox
          bg="white"
          px={5}
          py={3}
          borderRadius="2xl"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Flex justify="space-between" align="center">
            <HStack spacing={3}>
              <Image src="/logo.svg" h="32px" w="32px" alt="UPAO Logo" />
              <Box>
                <Heading size="xs" color="#002855" fontWeight="700">
                  Asesor Curricular UPAO (LangChain + Gemini RAG)
                </Heading>
                <Text fontSize="10px" color="gray.500" fontWeight="500">
                  Responde mediante los 4 Algoritmos Deterministas sin alucinaciones
                </Text>
              </Box>
            </HStack>
            <Badge colorScheme={isReportUploaded ? 'green' : 'orange'} borderRadius="full" px={3} py={1} fontSize="xs">
              {isReportUploaded ? '● Reporte Procesado' : '○ Cargar Historial'}
            </Badge>
          </Flex>
        </MotionBox>

        {/* Stream de Conversación Principal */}
        <Box
          flex={1}
          w="100%"
          overflowY="auto"
          p={{ base: 3, md: 6 }}
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="gray.100"
          shadow="sm"
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 10, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
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

        {/* Prompts Rápidos Sugeridos */}
        {isReportUploaded && (
          <HStack spacing={2} overflowX="auto" py={1} px={1}>
            <Button
              size="xs"
              variant="outline"
              colorScheme="blue"
              borderRadius="full"
              leftIcon={<FiZap />}
              onClick={() => handleQuickPrompt('¿Cuáles son los cursos recomendados para mi matrícula?')}
            >
              Recomendar Cursos
            </Button>
            <Button
              size="xs"
              variant="outline"
              colorScheme="purple"
              borderRadius="full"
              leftIcon={<FiCompass />}
              onClick={() => handleQuickPrompt('¿Cuántos créditos necesito para llevar Prácticas Pre-Profesionales?')}
            >
              Requisitos Prácticas
            </Button>
            <Button
              size="xs"
              variant="outline"
              colorScheme="teal"
              borderRadius="full"
              leftIcon={<FiBookOpen />}
              onClick={() => handleQuickPrompt('¿Cuáles son las convalidaciones de la Malla 2022 a la Malla 2025?')}
            >
              Convalidaciones
            </Button>
          </HStack>
        )}

        {/* Barra de Entrada Estilo Gemini / ChatGPT */}
        {!isReportUploaded ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FileUploader onFileUpload={handleFileUpload} />
          </MotionBox>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Flex
              bg="gray.50"
              p={2}
              borderRadius="2xl"
              border="1px solid"
              borderColor="gray.200"
              align="center"
              shadow="sm"
              _focusWithin={{ borderColor: '#002855', bg: 'white', shadow: 'md' }}
            >
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe un mensaje al Asesor Curricular..."
                disabled={isLoading}
                border="none"
                focusBorderColor="transparent"
                fontSize="sm"
                px={3}
              />
              <IconButton
                type="submit"
                icon={<FiSend />}
                colorScheme="blue"
                bg="#002855"
                size="md"
                borderRadius="xl"
                isLoading={isLoading}
                aria-label="Enviar mensaje"
                _hover={{ bg: '#001d3d' }}
              />
            </Flex>
          </form>
        )}
      </VStack>
    </Container>
  );
};

export default ChatPage;