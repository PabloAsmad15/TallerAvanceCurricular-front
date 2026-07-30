import { useState } from 'react';
import { Box, Text, VStack, Button, Flex, Avatar, HStack } from '@chakra-ui/react';
import { FiMail, FiUser, FiCheck } from 'react-icons/fi';

const ChatMessage = ({ message, isBot, onSendDirectEmail }) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // La opción de enviar por correo SOLO aplica para recomendaciones de cursos, NUNCA para el saludo inicial
  const isEmailable = isBot && (
    message.showEmailButton === true || 
    (message.content && (
      message.content.includes("Cursos Recomendados") || 
      message.content.includes("Recomendación de Cursos") ||
      message.content.includes("Recomendación de Matrícula")
    ))
  );

  const handleDirectEmailClick = async () => {
    if (onSendDirectEmail) {
      setIsSending(true);
      await onSendDirectEmail(message.content);
      setIsSending(false);
      setSentSuccess(true);
    }
  };

  return (
    <Flex
      w="100%"
      justify={isBot ? 'flex-start' : 'flex-end'}
      mb={5}
      gap={3}
      alignItems="flex-start"
    >
      {isBot && (
        <Avatar
          size="sm"
          src="/logo.svg"
          bg="#002855"
          p={1}
          boxShadow="sm"
        />
      )}

      <Box
        bg={isBot ? 'white' : '#002855'}
        color={isBot ? 'gray.800' : 'white'}
        px={5}
        py={4}
        borderRadius="2xl"
        borderTopLeftRadius={isBot ? '4px' : '2xl'}
        borderTopRightRadius={isBot ? '2xl' : '4px'}
        maxW={{ base: '90%', md: '80%' }}
        boxShadow={isBot ? 'sm' : 'md'}
        border={isBot ? '1px solid' : 'none'}
        borderColor={isBot ? 'gray.100' : 'transparent'}
      >
        <VStack align="stretch" spacing={2}>
          <Text fontSize="xs" fontWeight="700" color={isBot ? '#002855' : 'blue.100'}>
            {isBot ? 'Asesor Curricular UPAO' : 'Tú'}
          </Text>
          <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="1.6" color={isBot ? 'gray.700' : 'white'}>
            {message.content}
          </Text>

          {message.buttons && message.buttons.length > 0 && (
            <HStack spacing={2} pt={2} flexWrap="wrap">
              {message.buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  size="xs"
                  colorScheme="blue"
                  variant="outline"
                  onClick={btn.onClick}
                >
                  {btn.label}
                </Button>
              ))}
            </HStack>
          )}

          {isEmailable && (
            <Flex justify="flex-end" pt={1}>
              <Button
                size="xs"
                variant={sentSuccess ? "solid" : "ghost"}
                colorScheme={sentSuccess ? "green" : "blue"}
                leftIcon={sentSuccess ? <FiCheck /> : <FiMail />}
                isLoading={isSending}
                onClick={handleDirectEmailClick}
                _hover={{ bg: sentSuccess ? 'green.600' : 'blue.50' }}
              >
                {sentSuccess ? "Enviado a tu Correo Registrado" : "Enviar Evidencia por Correo"}
              </Button>
            </Flex>
          )}
        </VStack>
      </Box>

      {!isBot && (
        <Avatar
          size="sm"
          bg="gray.700"
          color="white"
          icon={<FiUser size="16" />}
        />
      )}
    </Flex>
  );
};

export default ChatMessage;