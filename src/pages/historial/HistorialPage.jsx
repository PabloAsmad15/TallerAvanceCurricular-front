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
} from '@chakra-ui/react';
import { FiCheckCircle, FiClock, FiAward, FiMail, FiBookOpen } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import chatService from '../../services/chatService';
import { mallasData } from '../../data/mallasData';

const HistorialPage = () => {
  const [academicHistory, setAcademicHistory] = useState({ cursos_codigos: [], malla_origen: 2025 });
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userEmail } = useAuthStore();
  const toast = useToast();

  useEffect(() => {
    const fetchDBHistory = async () => {
      setLoading(true);
      try {
        const [historyData, logsData] = await Promise.all([
          chatService.getMyAcademicHistory(),
          chatService.getRecommendationHistory(),
        ]);
        setAcademicHistory(historyData);
        setHistoryLogs(logsData || []);
      } catch (error) {
        console.error('Error al cargar historial desde base de datos:', error);
        toast({
          title: 'Error de carga',
          description: 'No se pudo recuperar el historial académico desde la base de datos.',
          status: 'error',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDBHistory();
    } else {
      setLoading(false);
    }
  }, [token, toast]);

  // Cruzar los códigos almacenados en DB con el catálogo de mallas para obtener nombre y créditos reales
  const allCoursesMap = useMemo(() => {
    const map = {};
    Object.values(mallasData.mallas).forEach(planList => {
      planList.forEach(curso => {
        map[curso.codigo] = curso;
      });
    });
    return map;
  }, []);

  const approvedCoursesList = (academicHistory.cursos_codigos || []).map(cod => {
    const found = allCoursesMap[cod];
    return {
      codigo: cod,
      nombre: found ? found.nombre : 'ASIGNATURA REGISTRADA',
      creditos: found ? found.creditos : 4,
      ciclo: found ? found.ciclo : 'Ciclo Regular'
    };
  });

  const totalCreditosAprobados = approvedCoursesList.reduce((acc, c) => acc + c.creditos, 0);

  return (
    <Container maxW="container.xl" py={6}>
      {/* Cabecera del Historial Académico */}
      <Box mb={6} bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="#002855" mb={1}>
              Historial Académico y Recomendaciones Emitidas
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Cargando registros reales en tiempo real desde la Base de Datos Supabase/PostgreSQL del estudiante {userEmail || 'UPAO'}.
            </Text>
          </Box>
          <HStack spacing={3}>
            <Badge colorScheme="green" p={3} borderRadius="xl" fontSize="xs">
              <HStack spacing={1}>
                <Icon as={FiAward} />
                <Text fontWeight="bold">{totalCreditosAprobados} Créditos Aprobados en DB</Text>
              </HStack>
            </Badge>
          </HStack>
        </Flex>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiBookOpen} /><Text>Mi Historial Académico DB ({approvedCoursesList.length} Cursos)</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiClock} /><Text>Historial de Recomendaciones Emitidas</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* TAB 1: HISTORIAL ACADÉMICO REAL DE CURSOS APROBADOS DE LA DB */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="#002855">
                  Asignaturas Aprobadas Registradas en PostgreSQL / Supabase
                </Heading>
                <Badge colorScheme="purple" borderRadius="full" px={3} py={1}>
                  Malla Origen {academicHistory.malla_origen || 2025}
                </Badge>
              </Flex>

              {loading ? (
                <Flex justify="center" p={8}>
                  <Spinner size="lg" color="#002855" thickness="4px" />
                </Flex>
              ) : approvedCoursesList.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
                  No hay asignaturas registradas aún en tu historial de la base de datos.
                </Text>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Ciclo</Th>
                      <Th>Código</Th>
                      <Th>Nombre de la Asignatura</Th>
                      <Th>Créditos</Th>
                      <Th>Estado en DB</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {approvedCoursesList.map((c, idx) => (
                      <Tr key={idx}>
                        <Td fontWeight="600" color="gray.500">{c.ciclo}</Td>
                        <Td fontWeight="bold" color="#002855">{c.codigo}</Td>
                        <Td fontWeight="600" color="gray.800">{c.nombre}</Td>
                        <Td><Badge colorScheme="purple">{c.creditos} crd</Badge></Td>
                        <Td>
                          <Badge colorScheme="green">
                            <HStack spacing={1}>
                              <Icon as={FiCheckCircle} />
                              <Text>Aprobado en DB</Text>
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

          {/* TAB 2: HISTORIAL REAL DE RECOMENDACIONES EMITIDAS */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Constancias de Recomendación Emitidas por los 4 Algoritmos
              </Heading>

              {loading ? (
                <Flex justify="center" p={8}>
                  <Spinner size="lg" color="#002855" thickness="4px" />
                </Flex>
              ) : historyLogs.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
                  No tienes constancias de recomendación emitidas previamente en la base de datos.
                </Text>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Fecha y Hora</Th>
                      <Th>Algoritmo Utilizado</Th>
                      <Th>Constancia de Evidencia</Th>
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
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default HistorialPage;
