import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Badge,
  Flex,
  HStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
} from '@chakra-ui/react';
import { FiCheckCircle, FiClock, FiAward, FiMail } from 'react-icons/fi';
import axios from 'axios';
import useAuthStore from '../../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'https://taller-avance-curricular-upao.fly.dev';

const HistorialPage = () => {
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const defaultApprovedCourses = [
    { codigo: 'ICSI-506', nombre: 'ALGORITMIA Y PROGRAMACIÓN', creditos: 4, ciclo: 'Ciclo I', estado: 'Aprobado' },
    { codigo: 'HUMA-900', nombre: 'METODOLOGIA DEL APRENDIZAJE UNIVERSITARIO', creditos: 2, ciclo: 'Ciclo I', estado: 'Aprobado' },
    { codigo: 'HUMA-1179', nombre: 'COMUNICACIÓN I', creditos: 4, ciclo: 'Ciclo I', estado: 'Aprobado' },
    { codigo: 'ISIA-100', nombre: 'INTRODUCCIÓN A LA INGENIERÍA DE SISTEMAS EINTELIGENCIA ARTIFICIAL', creditos: 2, ciclo: 'Ciclo I', estado: 'Aprobado' },
    { codigo: 'CIEN-752', nombre: 'ALGEBRA MATRICIAL Y GEOMETRÍA ANALÍTICA', creditos: 4, ciclo: 'Ciclo I', estado: 'Aprobado' },
    { codigo: 'CIEN-753', nombre: 'CÁLCULO I', creditos: 4, ciclo: 'Ciclo I', estado: 'Aprobado' },
    { codigo: 'ICSI-509', nombre: 'PROGRAMACIÓN ORIENTADO A OBJETOS', creditos: 4, ciclo: 'Ciclo II', estado: 'Aprobado' },
    { codigo: 'HUMA-1181', nombre: 'FILOSOFIA Y PENSAMIENTO CRÍTICO', creditos: 3, ciclo: 'Ciclo II', estado: 'Aprobado' },
    { codigo: 'HUMA-1180', nombre: 'COMUNICACIÓN II', creditos: 2, ciclo: 'Ciclo II', estado: 'Aprobado' },
  ];

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`${API_URL}/chat/history`, config);
        setHistoryLogs(response.data || []);
      } catch (error) {
        console.error('Error al cargar historial:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchHistory();
    } else {
      setLoading(false);
    }
  }, [token]);

  const totalCreditosAprobados = defaultApprovedCourses.reduce((acc, c) => acc + c.creditos, 0);

  return (
    <Container maxW="container.xl" py={6}>
      {/* Cabecera del Historial de Recomendaciones */}
      <Box mb={6} bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="#002855" mb={1}>
              Historial de Recomendaciones y Evidencias Emitidas
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Consulta las constancias de recomendaciones enviadas por el Asesor IA y tus asignaturas reconocidas en la plataforma.
            </Text>
          </Box>
          <HStack spacing={3}>
            <Badge colorScheme="green" p={2} borderRadius="md" fontSize="xs">
              <HStack spacing={1}>
                <Icon as={FiAward} />
                <Text>{totalCreditosAprobados} Créditos Registrados</Text>
              </HStack>
            </Badge>
          </HStack>
        </Flex>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiClock} /><Text>Historial de Recomendaciones IA</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiCheckCircle} /><Text>Mis Cursos Registrados</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* TAB 1: HISTORIAL DE RECOMENDACIONES */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Registro de Recomendaciones Generadas por los 4 Algoritmos
              </Heading>

              {loading ? (
                <Flex justify="center" p={6}>
                  <Spinner size="md" color="#002855" />
                </Flex>
              ) : historyLogs.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
                  No tienes recomendaciones registradas previamente. Puedes solicitar una nueva recomendación en la sección Asesor IA.
                </Text>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Fecha y Hora</Th>
                      <Th>Algoritmo Utilizado</Th>
                      <Th>Estado de Constancia</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {historyLogs.map((log, idx) => (
                      <Tr key={idx}>
                        <Td color="gray.600" fontSize="xs">{log.created_at || 'Reciente'}</Td>
                        <Td><Badge colorScheme="purple">{log.solver_utilizado || '4 Algoritmos UPAO'}</Badge></Td>
                        <Td>
                          <Badge colorScheme="teal">
                            <HStack spacing={1}>
                              <Icon as={FiMail} />
                              <Text>Enviado por Correo</Text>
                            </HStack>
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </TabPanel>

          {/* TAB 2: VISTA DE CURSOS REGISTRADOS */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="#002855">
                  Asignaturas Registradas en el Expediente Académico
                </Heading>
                <Badge colorScheme="blue" borderRadius="full" px={3} py={1}>
                  Malla Vigente 2025
                </Badge>
              </Flex>

              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Ciclo</Th>
                    <Th>Código</Th>
                    <Th>Nombre de la Asignatura</Th>
                    <Th>Créditos</Th>
                    <Th>Estado</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {defaultApprovedCourses.map((c, idx) => (
                    <Tr key={idx}>
                      <Td fontWeight="600" color="gray.500">{c.ciclo}</Td>
                      <Td fontWeight="bold" color="#002855">{c.codigo}</Td>
                      <Td fontWeight="600" color="gray.800">{c.nombre}</Td>
                      <Td><Badge colorScheme="purple">{c.creditos} crd</Badge></Td>
                      <Td>
                        <Badge colorScheme="green">
                          <HStack spacing={1}>
                            <Icon as={FiCheckCircle} />
                            <Text>Aprobado</Text>
                          </HStack>
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default HistorialPage;
