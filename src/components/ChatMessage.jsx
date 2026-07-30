import { useState } from 'react';
import { Box, Text, VStack, Button, Flex, Avatar, useDisclosure, HStack } from '@chakra-ui/react';
import { FiMail, FiCpu, FiUser } from 'react-icons/fi';
import SendEmailModal from './SendEmailModal';

const ChatMessage = ({ message, isBot }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Determinar si el mensaje parece una recomendación o respuesta del bot que se puede enviar por correo
  const isEmailable = isBot && message.content && message.content.trim().length > 0;

  return (
    <>
      <Flex
        w="100%"
        justify={isBot ? 'flex-start' : 'flex-end'}
        mb={4}
        gap={3}
        alignItems="flex-start"
      >
        {isBot && (
          <Avatar
            size="sm"
            bg="brand.500"
            color="white"
            icon={<FiCpu size="18" />}
            mt={1}
          />
        )}

        <Box
          bg={isBot ? 'white' : 'brand.500'}
          color={isBot ? 'gray.800' : 'white'}
          p={4}
          borderRadius={isBot ? '2xl' : '2xl'}
          borderTopLeftRadius={isBot ? 'xs' : '2xl'}
          borderTopRightRadius={isBot ? '2xl' : 'xs'}
          maxW={{ base: '85%', md: '75%' }}
          boxShadow={isBot ? 'sm' : 'md'}
          border={isBot ? '1px solid' : 'none'}
          borderColor={isBot ? 'gray.200' : 'transparent'}
        >
          <VStack align="stretch" spacing={2}>
            <Text fontSize="xs" fontWeight="bold" color={isBot ? 'brand.600' : 'brand.100'}>
              {isBot ? 'Asesor Virtual UPAO' : 'Tú'}
            </Text>
            <Text fontSize="sm" whiteSpace="pre-wrap" lineHeight="relaxed">
              {message.content}
            </Text>

            {message.buttons && message.buttons.length > 0 && (
              <HStack spacing={2} pt={2} flexWrap="wrap">
                {message.buttons.map((btn, idx) => (
                  <Button
                    key={idx}
                    size="xs"
                    colorScheme="brand"
                    variant="outline"
                    onClick={btn.onClick}
                  >
                    {btn.label}
                  </Button>
                ))}
              </HStack>
            )}

            {isEmailable && (
              <Flex justify="flex-end" pt={2}>
                <Button
                  size="xs"
                  variant="ghost"
                  colorScheme="brand"
                  leftIcon={<FiMail />}
                  onClick={onOpen}
                  _hover={{ bg: 'brand.50' }}
                >
                  Enviar por correo
                </Button>
              </Flex>
            )}
          </VStack>
        </Box>

        {!isBot && (
          <Avatar
            size="sm"
            bg="gray.600"
            color="white"
            icon={<FiUser size="18" />}
            mt={1}
          />
        )}
      </Flex>

      {isEmailable && (
        <SendEmailModal
          isOpen={isOpen}
          onClose={onClose}
          recommendationContent={message.content}
        />
      )}
    </>
  );
};

export default ChatMessage;