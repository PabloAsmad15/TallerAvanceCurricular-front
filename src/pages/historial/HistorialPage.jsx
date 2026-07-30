import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Flex,
  HStack,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAward, FiClock, FiCpu } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

const HistorialPage = () => {
  const { userEmail } = useAuthStore();

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Heading size="lg" color="#002855" mb={1}>
          Mi Historial Académico Procesado
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Resumen de avance curricular y recomendaciones históricas registradas para {userEmail || 'pasmadm1@upao.edu.pe'}.
        </Text>
      </Box>

      {/* Resumen de Métricas de Avance */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Malla Origen Identificada</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">Malla 2025</StatNumber>
                <StatHelpText fontSize="xs" color="green.500">Ingeniería de Software</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="blue.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiAward} w={6} h={6} color="#002855" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Cursos Aprobados</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">18 Asignaturas</StatNumber>
                <StatHelpText fontSize="xs" color="green.500">72 Créditos acumulados</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="green.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiCheckCircle} w={6} h={6} color="green.600" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Última Actualización</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="purple.600">Hoy</StatNumber>
                <StatHelpText fontSize="xs" color="gray.500">Sincronizado con BD Supabase</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="purple.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiClock} w={6} h={6} color="purple.600" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Historial de Recomendaciones Guardadas */}
      <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Heading size="sm" color="#002855" mb={4}>
          Recomendaciones Inteligentes Registradas
        </Heading>
        
        <VStack spacing={4} align="stretch">
          <Box p={4} border="1px solid" borderColor="gray.200" borderRadius="xl" bg="gray.50">
            <Flex justify="space-between" align="center" mb={2}>
              <HStack spacing={2}>
                <Icon as={FiCpu} color="purple.600" />
                <Text fontWeight="bold" fontSize="sm" color="gray.800">Recomendación de Cursos - Ciclo 2025-I</Text>
              </HStack>
              <Badge colorScheme="purple">Backtracking + CP Solver</Badge>
            </Flex>
            <Divider my={2} />
            <Text fontSize="xs" color="gray.700" mb={2}>
              Basado en tus cursos aprobados y prerrequisitos de la Malla 2025, la IA recomienda matricularte en:
            </Text>
            <VStack align="stretch" spacing={1} pl={4}>
              <Text fontSize="xs" fontWeight="600" color="#002855">1. IS-301 - Bases de Datos II (4 créditos)</Text>
              <Text fontSize="xs" fontWeight="600" color="#002855">2. IS-302 - Desarrollo Web (4 créditos)</Text>
              <Text fontSize="xs" fontWeight="600" color="#002855">3. IS-304 - Inteligencia Artificial (4 créditos)</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Container>
  );
};

export default HistorialPage;
