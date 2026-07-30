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
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FiUsers, FiCpu, FiCheckCircle, FiActivity, FiCheck, FiX, FiLayers, FiGitBranch, FiMessageSquare } from 'react-icons/fi';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://taller-avance-curricular-upao.fly.dev';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_recommendations: 0,
    success_rate: 100,
    algorithms: {
      backtracking: 0,
      constraint_programming: 0,
      langchain_agent: 0,
      multimalla_convalida: 0,
    },
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

  const algos = stats.algorithms || {
    backtracking: 0,
    constraint_programming: 0,
    langchain_agent: 0,
    multimalla_convalida: 0,
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Heading size="lg" color="#002855" mb={1}>
          Monitoreo del Panel Administrador UPAO
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Supervisión en tiempo real de los 4 Algoritmos Principales, usuarios e interacciones.
        </Text>
      </Box>

      {/* Métricas Generales */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
        <Card shadow="sm" border="1px solid" borderColor="gray.100" borderRadius="xl">
          <CardBody>
            <Flex justify="space-between" align="center">
              <Stat>
                <StatLabel fontSize="xs" color="gray.500">Usuarios Registrados</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">{stats.total_users}</StatNumber>
                <StatHelpText fontSize="xs" color="green.500">Sesiones Activas</StatHelpText>
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
                <StatNumber fontSize="2xl" fontWeight="bold" color="#002855">{stats.total_recommendations}</StatNumber>
                <StatHelpText fontSize="xs" color="purple.600">Ejecutadas por Solvers</StatHelpText>
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
                <StatLabel fontSize="xs" color="gray.500">Tasa de Satisfacción IA</StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" color="green.600">{stats.success_rate}%</StatNumber>
                <StatHelpText fontSize="xs" color="gray.500">Respuestas Convalidadas</StatHelpText>
              </Stat>
              <Flex w={12} h={12} bg="green.50" borderRadius="xl" align="center" justify="center">
                <Icon as={FiCheckCircle} w={6} h={6} color="green.600" />
              </Flex>
            </Flex>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* MONITOREO DEDICADO DE LOS 4 ALGORITMOS */}
      <Box mb={8}>
        <Flex align="center" gap={2} mb={4}>
          <Icon as={FiCpu} color="#002855" w={5} h={5} />
          <Heading size="md" color="#002855">
            Monitoreo en Vivo de los 4 Algoritmos Inteligentes
          </Heading>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {/* Algoritmo 1 */}
          <Card shadow="xs" border="1px solid" borderColor="purple.200" borderRadius="xl" bg="purple.50">
            <CardBody p={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Badge colorScheme="purple">Algoritmo 1</Badge>
                <Icon as={FiGitBranch} color="purple.700" />
              </Flex>
              <Text fontWeight="bold" fontSize="sm" color="purple.900" mb={1}>
                Solver Backtracking
              </Text>
              <Text fontSize="xs" color="purple.700" mb={2}>
                Búsqueda exhaustiva por ramas de prerrequisitos.
              </Text>
              <Divider borderColor="purple.200" mb={2} />
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.600">Ejecuciones:</Text>
                <Text fontWeight="bold" fontSize="md" color="purple.900">{algos.backtracking}</Text>
              </Flex>
            </CardBody>
          </Card>

          {/* Algoritmo 2 */}
          <Card shadow="xs" border="1px solid" borderColor="blue.200" borderRadius="xl" bg="blue.50">
            <CardBody p={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Badge colorScheme="blue">Algoritmo 2</Badge>
                <Icon as={FiCpu} color="blue.700" />
              </Flex>
              <Text fontWeight="bold" fontSize="sm" color="blue.900" mb={1}>
                Constraint Programming
              </Text>
              <Text fontSize="xs" color="blue.700" mb={2}>
                CP-SAT / OR-Tools para mallas complejas.
              </Text>
              <Divider borderColor="blue.200" mb={2} />
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.600">Ejecuciones:</Text>
                <Text fontWeight="bold" fontSize="md" color="blue.900">{algos.constraint_programming}</Text>
              </Flex>
            </CardBody>
          </Card>

          {/* Algoritmo 3 */}
          <Card shadow="xs" border="1px solid" borderColor="teal.200" borderRadius="xl" bg="teal.50">
            <CardBody p={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Badge colorScheme="teal">Algoritmo 3</Badge>
                <Icon as={FiMessageSquare} color="teal.700" />
              </Flex>
              <Text fontWeight="bold" fontSize="sm" color="teal.900" mb={1}>
                Agente LangChain + LLM
              </Text>
              <Text fontSize="xs" color="teal.700" mb={2}>
                Explicación pedagógica inteligente (Gemini API).
              </Text>
              <Divider borderColor="teal.200" mb={2} />
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.600">Ejecuciones:</Text>
                <Text fontWeight="bold" fontSize="md" color="teal.900">{algos.langchain_agent}</Text>
              </Flex>
            </CardBody>
          </Card>

          {/* Algoritmo 4 */}
          <Card shadow="xs" border="1px solid" borderColor="orange.200" borderRadius="xl" bg="orange.50">
            <CardBody p={4}>
              <Flex justify="space-between" align="center" mb={2}>
                <Badge colorScheme="orange">Algoritmo 4</Badge>
                <Icon as={FiLayers} color="orange.700" />
              </Flex>
              <Text fontWeight="bold" fontSize="sm" color="orange.900" mb={1}>
                Convalidador Multimalla
              </Text>
              <Text fontSize="xs" color="orange.700" mb={2}>
                Traductor de Mallas 2015/2019/2022 a 2025.
              </Text>
              <Divider borderColor="orange.200" mb={2} />
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color="gray.600">Ejecuciones:</Text>
                <Text fontWeight="bold" fontSize="md" color="orange.900">{algos.multimalla_convalida}</Text>
              </Flex>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>

      {/* Tabla de Logs de Interacción */}
      <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="md" color="gray.800">
            Registro Cronológico de Interacción de Alumnos
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
            No hay recomendaciones registradas aún en la base de datos.
          </Text>
        ) : (
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th>Correo Alumno</Th>
                <Th>Fecha y Hora</Th>
                <Th>Algoritmo Utilizado</Th>
                <Th>Estado</Th>
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
