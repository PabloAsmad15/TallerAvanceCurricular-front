import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { FiUsers, FiCpu, FiCheckCircle, FiActivity, FiCheck, FiX } from 'react-icons/fi';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://taller-avance-curricular-upao.fly.dev';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_recommendations: 0,
    backtracking_count: 0,
    constraint_count: 0,
    success_rate: 100,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();
  const toast = useToast();

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const [statsRes, logsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/stats`, config),
          axios.get(`${API_URL}/admin/logs`, config),
        ]);
        setStats(statsRes.data);
        setLogs(logsRes.data);
      } catch (error) {
        console.error('Error al cargar datos de admin:', error);
        toast({
          title: 'Error de panel admin',
          description: 'No se pudieron recuperar las métricas en tiempo real.',
          status: 'error',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAdminData();
    }
  }, [token, toast]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="400px">
        <Spinner size="xl" color="#002855" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Heading size="lg" color="#002855" mb={1}>
          Panel de Control Administrador UPAO
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Monitoreo total en tiempo real de recomendaciones, interacción de alumnos y rendimiento de solvers.
        </Text>
      </Box>

      {/* Métricas Principales en Tiempo Real desde Postgres */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Total Usuarios Registrados</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">
                  {stats.total_users}
                </StatNumber>
                <StatHelpText fontSize="xs" color="green.500">Alumnos y Administradores</StatHelpText>
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
                <StatLabel fontSize="xs" color="gray.500">Recomendaciones Emitidas</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">
                  {stats.total_recommendations}
                </StatNumber>
                <StatHelpText fontSize="xs" color="purple.600">
                  {stats.backtracking_count} BT / {stats.constraint_count} CP
                </StatHelpText>
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
                <StatLabel fontSize="xs" color="gray.500">Tasa de Éxito de Recomendación</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="green.600">
                  {stats.success_rate}%
                </StatNumber>
                <StatHelpText fontSize="xs" color="gray.500">Respuesta satisfactoria de IA</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="green.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiCheckCircle} w={6} h={6} color="green.600" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Registro de Interacciones de Usuarios en Tiempo Real */}
      <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="gray.800">
            Historial de Interacción y Recomendaciones de Alumnos
          </Heading>
          <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
            <Flex align="center" gap={1}>
              <Icon as={FiActivity} />
              En Tiempo Real
            </Flex>
          </Badge>
        </Flex>

        {logs.length === 0 ? (
          <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
            No hay recomendaciones registradas aún en el sistema.
          </Text>
        ) : (
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Correo Alumno</Th>
                <Th>Fecha y Hora</Th>
                <Th>Algoritmo / Solver</Th>
                <Th>Resultado</Th>
              </Tr>
            </Thead>
            <Tbody>
              {logs.map((log) => (
                <Tr key={log.id}>
                  <Td fontWeight="600" color="gray.800">{log.user_email}</Td>
                  <Td color="gray.500" fontSize="xs">{log.created_at}</Td>
                  <Td>
                    <Badge colorScheme={log.solver === 'Backtracking' ? 'purple' : 'blue'}>
                      {log.solver}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={log.success ? 'green' : 'red'}>
                      <Flex align="center" gap={1}>
                        <Icon as={log.success ? FiCheck : FiX} />
                        {log.success ? 'Éxito' : 'Fallido'}
                      </Flex>
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Container>
  );
};

export default AdminDashboard;
