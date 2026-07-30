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
} from '@chakra-ui/react';
import { FiSend, FiZap, FiHelpCircle, FiMail } from 'react-icons/fi';
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
        content: "¡Hola! Soy tu Asesor Curricular Virtual UPAO. ¿En qué te puedo ayudar hoy? Puedes solicitar una recomendación para el próximo ciclo o realizar preguntas sobre tu avance académico.",
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
        content: response.message || "¡Excelente! Ya cargué tu historial académico de la base de datos. Puedes escribir 'Quiero que me des la recomendación para el próximo ciclo' o consultar sobre tus materias.",
        isBot: true,
      });
    } catch (error) {
      toast({
        title: 'Error al procesar el archivo',
        description: error.response?.data?.detail || 'No se pudo procesar el archivo. Inténtalo nuevamente.',
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

      const formattedRecommendation = `🔍 *Buscando tu historial académico en la base de datos Supabase...*\n\n${response.explicacion}\n\n📚 *Cursos Recomendados para tu Matrícula (Malla 2025)*:\n${cursosTexto}`;

      addMessage({
        content: formattedRecommendation,
        isBot: true,
        buttons: [
          {
            label: "✉️ Enviar Constancia a mi Correo",
            onClick: () => handleSendEmailAction(formattedRecommendation),
          },
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

  const handleSendEmailAction = async (contentToSend) => {
    setIsLoading(true);
    try {
      await chatService.sendEmail({
        content: contentToSend,
        subject: "Evidencia de Recomendación Curricular UPAO"
      });
      toast({
        title: 'Correo Enviado',
        description: 'Se ha enviado la constancia formal de recomendación a tu correo institucional UPAO.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      addMessage({
        content: "✉️ ¡Listo! He enviado la constancia detallada de recomendación a tu correo institucional UPAO.",
        isBot: true,
      });
    } catch (error) {
      toast({
        title: 'Error al enviar correo',
        description: 'No se pudo enviar la constancia por correo. Inténtalo nuevamente.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskWhyRecommendation = async () => {
    addMessage({
      content: "¿Por qué me diste esa recomendación y no otra?",
      isBot: false,
    });

    setIsLoading(true);
    try {
      const promptWhy = "¿Por qué me diste esa recomendación y no otra? Explícame las restricciones de prerrequisitos, límites de créditos por ciclo y el análisis de los 4 algoritmos.";
      const response = await chatService.sendGeneralQuery(promptWhy);

      const explicacionRestricciones = `${response.respuesta}\n\n🛡️ *FUNDAMENTACIÓN TÉCNICA DE RESTRICCIONES Y 4 ALGORITMOS*:\n` +
        `• *Prerrequisitos Estrictos (Constraint Programming)*: Se verificó el árbol de prerrequisitos en la base de datos. Ninguna asignatura avanzada fue incluida sin haber completado sus materias previas obligatorias.\n` +
        `• *Tope Máximo de Créditos por Semestre*: La recomendación respeta el límite regulatorio máximo (máx. 22 créditos) para evitar sobrecarga académica.\n` +
        `• *Optimización de Ramas (Backtracking)*: Priorizó los cursos que abren mayor cantidad de asignaturas en ciclos posteriores (cadena crítica).\n` +
        `• *Reglas de Asociación Apriori & Prolog*: Minaron los patrones de mayor tasa de éxito de estudiantes UPAO en la Malla 2025.`;

      addMessage({
        content: explicacionRestricciones,
        isBot: true,
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
                  Asesor Curricular UPAO (4 Algoritmos + RAG)
                </Heading>
                <Text fontSize="10px" color="gray.500" fontWeight="500">
                  Evaluación determinista sin alucinaciones basada en tu historial académico
                </Text>
              </Box>
            </HStack>
            <Badge colorScheme={isReportUploaded ? 'green' : 'blue'} borderRadius="full" px={3} py={1} fontSize="xs">
              {isReportUploaded ? '● Historial Activo' : '● Conectado a DB'}
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