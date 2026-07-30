import { Box, Heading, Text } from '@chakra-ui/react';

const TestPage = () => {
  return (
    <Box p={8} maxWidth="500px" mx="auto">
      <Heading mb={4}>Página de Prueba</Heading>
      <Text>Si puedes ver esto, significa que el routing y Chakra UI están funcionando correctamente.</Text>
    </Box>
  );
};

export default TestPage;