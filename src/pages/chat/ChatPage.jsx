import { useState, useRef, useEffect, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { FiSend, FiZap, FiHelpCircle, FiPlusCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from '../../components/ChatMessage';
import useChatStore from '../../store/chatStore';
import useAuthStore from '../../store/authStore';
import chatService from '../../services/chatService';

const MotionBox = motion(Box);

const ChatPage = () => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  const { userEmail } = useAuthStore();
  const {
    messages,
    hasSentFirstEmail,
    isLoading,
    addMessage,
    clearMessages,
    setHasSentFirstEmail,
    setIsLoading,
  } = useChatStore();

  const userName = useMemo(() => {
    if (!userEmail) return 'Pablo';
    const emailLower = userEmail.toLowerCase();
    if (emailLower.includes('pasm') || emailLower.includes('pablo')) {
      return 'Pablo';
    }
    const emailPrefix = userEmail.split('@')[0];
    const rawName = emailPrefix.split('.')[0].replace(/[0-9]/g, '');
    if (!rawName || rawName.length < 2) return 'Pablo';
    return rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  }, [userEmail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        content: `¡Hola, ${userName}! Soy tu Asesor Curricular Virtual UPAO. ¿En qué te puedo ayudar hoy?`,
        isBot: true,
        showEmailButton: false,
      });
    }
  }, [addMessage, messages.length, userName]);

  const handleNewChat = () => {
    if (clearMessages) {
      clearMessages();
    }
    toast({
      title: 'Nuevo Chat Iniciado',
      description: 'Se ha reiniciado la sesión de conversación.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
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

      const formattedRecommendation = `${response.explicacion}\n\n📚 *Cursos Recomendados para tu Matrícula (Malla 2025)*:\n${cursosTexto}`;

      addMessage({
        content: formattedRecommendation,
        isBot: true,
        showEmailButton: true,
        buttons: [
          {
            label: "❓ ¿Por qué me diste esa recomendación y no otra?",
            onClick: () => handleAskWhyRecommendation(),
          }
        ]
      });

      if (!hasSentFirstEmail && sendEmail) {
        setHasSentFirstEmail(true);
      }
    } catch (error) {
      toast({
        title: 'Error al obtener recomendación',
        description: error.response?.data?.detail || 'Ocurrió un error al generar la recomendación.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendDirectEmailAction = async (contentToSend) => {
    try {
      await chatService.sendEmail({
        content: contentToSend,
        subject: "Evidencia de Recomendación Curricular UPAO"
      });

      toast({
        title: 'Correo Enviado',
        description: `Se ha enviado la constancia a ${userEmail || 'tu correo registrado'}.`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });

      addMessage({
        content: `✉️ ¡El correo ha sido enviado con éxito a tu dirección registrada (${userEmail || 'UPAO'})! ¿Te puedo ayudar a resolver algo más?`,
        isBot: true,
        showEmailButton: false,
      });
    } catch (error) {
      toast({
        title: 'Error al enviar correo',
        description: 'No se pudo enviar la constancia por correo.',
        status: 'error',
        duration: 4000,
      });
    }
  };

  const handleAskWhyRecommendation = async () => {
    addMessage({
      content: "¿Por qué me diste esa recomendación y no otra?",
      isBot: false,
    });

    setIsLoading(true);
    try {
      const promptWhy = "¿Por qué me diste esa recomendación y no otra? Explícame las restricciones de prerrequisitos, límites de créditos por ciclo y la selección interna del mejor algoritmo.";
      const response = await chatService.sendGeneralQuery(promptWhy);

      addMessage({
        content: response.respuesta,
        isBot: true,
        showEmailButton: false,
      });
    } catch (error) {
      toast({
        title: 'Error de respuesta',
        description: 'No se pudo procesar la fundamentación.',
        status: 'error',
        duration: 4000,
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

    if (inputLower.includes('recomendación') || inputLower.includes('recomienda') || inputLower.includes('próximo ciclo') || inputLower.includes('proximo ciclo')) {
      await handleRecommendation(false);
    } else if (inputLower.includes('por qué') || inputLower.includes('por que') || inputLower.includes('otra') || inputLower.includes('restriccion')) {
      await handleAskWhyRecommendation();
    } else {
      setIsLoading(true);
      try {
        const response = await chatService.sendGeneralQuery(currentQuery);
        addMessage({
          content: response.respuesta,
          isBot: true,
          showEmailButton: false,
        });
      } catch (error) {
        toast({
          title: 'Error al procesar consulta',
          description: error.response?.data?.detail || 'No se pudo procesar el mensaje.',
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
        {/* Header Minimalista Estilo Gemini / ChatGPT con Botón + Nuevo Chat */}
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
              <Image src="/logo.svg" h="38px" w="38px" alt="UPAO Logo" objectFit="contain" />
              <Box>
                <Heading size="xs" color="#002855" fontWeight="700">
                  Asesor Curricular UPAO
                </Heading>
                <Text fontSize="10px" color="gray.500" fontWeight="500">
                  Evaluación determinista e inteligente sin alucinaciones
                </Text>
              </Box>
            </HStack>

            <HStack spacing={3}>
              <Button
                size="xs"
                colorScheme="blue"
                variant="outline"
                borderRadius="lg"
                leftIcon={<FiPlusCircle />}
                onClick={handleNewChat}
                _hover={{ bg: 'blue.50' }}
              >
                + Nuevo Chat
              </Button>
              <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
                ● Usuario: {userName}
              </Badge>
            </HStack>
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
                  onSendDirectEmail={handleSendDirectEmailAction}
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
        <HStack spacing={2} overflowX="auto" py={1} px={1}>
          <Button
            size="xs"
            variant="solid"
            colorScheme="blue"
            bg="#002855"
            borderRadius="full"
            leftIcon={<FiZap />}
            onClick={() => {
              setUserInput('Quiero que me des la recomendación para el próximo ciclo');
            }}
          >
            Quiero recomendación para el próximo ciclo
          </Button>
          <Button
            size="xs"
            variant="outline"
            colorScheme="purple"
            borderRadius="full"
            leftIcon={<FiHelpCircle />}
            onClick={() => handleAskWhyRecommendation()}
          >
            ¿Por qué me diste esa recomendación y no otra?
          </Button>
        </HStack>

        {/* Barra de Entrada Estilo Gemini / ChatGPT */}
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
              placeholder="Escribe: Quiero que me des la recomendación para el próximo ciclo..."
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
      </VStack>
    </Container>
  );
};

export default ChatPage;