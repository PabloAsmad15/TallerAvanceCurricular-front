import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, Stat, StatLabel, StatNumber, StatHelpText, Icon, Flex, Badge, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { FiUsers, FiCpu, FiCheckCircle, FiActivity } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" color="#002855" mb={1}>
          Panel de Administración UPAO
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Monitoreo del motor de recomendación inteligente y uso del sistema.
        </Text>
      </Box>

      {/* Métricas Principales */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Estudiantes Registrados</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">1,248</StatNumber>
                <StatHelpText fontSize="xs" color="green.500">↑ 12% este mes</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="blue.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiUsers} w={6} h={6} color="#002855" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Recomendaciones Generadas</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">3,890</StatNumber>
                <StatHelpText fontSize="xs" color="green.500">Backtracking + CP Solver</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="purple.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiCpu} w={6} h={6} color="purple.600" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>

        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Estado del Sistema</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="green.600">En Línea</StatNumber>
                <StatHelpText fontSize="xs" color="gray.500">Fly.io + FastAPI API</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="green.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiCheckCircle} w={6} h={6} color="green.600" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Tabla de Actividad Reciente */}
      <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="gray.800">
            Registro Reciente de Solicitudes
          </Heading>
          <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
            <Flex align="center" gap={1}>
              <Icon as={FiActivity} />
              En Tiempo Real
            </Flex>
          </Badge>
        </Flex>

        <Table variant="simple" size="sm">
          <Thead bg="gray.50">
            <Tr>
              <Th>Usuario</Th>
              <Th>Fecha</Th>
              <Th>Solver</Th>
              <Th>Estado</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td fontWeight="600">pasmadm1@upao.edu.pe</Td>
              <Td color="gray.500">Hace 2 minutos</Td>
              <Td><Badge colorScheme="purple">Backtracking</Badge></Td>
              <Td><Badge colorScheme="green">Exitoso</Badge></Td>
            </Tr>
            <Tr>
              <Td fontWeight="600">alumno.demo@upao.edu.pe</Td>
              <Td color="gray.500">Hace 15 minutos</Td>
              <Td><Badge colorScheme="blue">ConstraintProgramming</Badge></Td>
              <Td><Badge colorScheme="green">Exitoso</Badge></Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
