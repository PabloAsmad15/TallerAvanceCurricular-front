import { useState, useEffect, useMemo } from 'react';
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAward, FiBookOpen, FiCpu } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import chatService from '../../services/chatService';
import { mallasData } from '../../data/mallasData';

const getCycleRank = (cicloStr) => {
  if (!cicloStr) return 99;
  const lower = cicloStr.toLowerCase();
  if (lower.includes('ciclo i') && !lower.includes('ii') && !lower.includes('v') && !lower.includes('x')) return 1;
  if (lower.includes('ciclo ii') && !lower.includes('iii')) return 2;
  if (lower.includes('ciclo iii')) return 3;
  if (lower.includes('ciclo iv')) return 4;
  if (lower.includes('ciclo v') && !lower.includes('vi')) return 5;
  if (lower.includes('ciclo vi') && !lower.includes('vii')) return 6;
  if (lower.includes('ciclo vii')) return 7;
  if (lower.includes('ciclo viii')) return 8;
  if (lower.includes('ciclo ix')) return 9;
  if (lower.includes('ciclo x')) return 10;
  return 99;
};

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

  // Mapa global de todas las mallas para resolver nombres, créditos y ciclos exactos
  const allCoursesMap = useMemo(() => {
    const map = {};
    Object.values(mallasData.mallas).forEach(planList => {
      planList.forEach(curso => {
        if (!map[curso.codigo]) {
          map[curso.codigo] = curso;
        }
      });
    });
    return map;
  }, []);

  // Lista ordenada por ciclo de menor a mayor (Ciclo I -> Ciclo II -> Ciclo III -> Ciclo IV -> Ciclo V)
  const approvedCoursesList = useMemo(() => {
    const list = (academicHistory.cursos_codigos || []).map(cod => {
      const found = allCoursesMap[cod];
      return {
        codigo: cod,
        nombre: found ? found.nombre : cod,
        creditos: found ? found.creditos : 4,
        ciclo: found ? found.ciclo : 'Ciclo I'
      };
    });

    return list.sort((a, b) => getCycleRank(a.ciclo) - getCycleRank(b.ciclo));
  }, [academicHistory.cursos_codigos, allCoursesMap]);

  const totalCreditosAprobados = approvedCoursesList.reduce((acc, c) => acc + c.creditos, 0);

  return (
    <Container maxW="container.xl" py={6}>
      {/* Cabecera Principal */}
      <Box mb={6} bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box>
            <Heading size="lg" color="#002855" mb={1}>
              Expediente Académico y Recomendaciones IA
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Registros en tiempo real desde Supabase / PostgreSQL para el alumno {userEmail || 'UPAO'}.
            </Text>
          </Box>
          <HStack spacing={3}>
            <Badge colorScheme="green" p={3} borderRadius="xl" fontSize="xs">
              <HStack spacing={1}>
                <Icon as={FiAward} />
                <Text fontWeight="bold">{totalCreditosAprobados} Créditos Acumulados</Text>
              </HStack>
            </Badge>
          </HStack>
        </Flex>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiBookOpen} /><Text>📚 Cursos Aprobados ({approvedCoursesList.length})</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiCpu} /><Text>🤖 Recomendaciones IA ({historyLogs.length})</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* PESTAÑA 1: CURSOS APROBADOS ORDENADOS POR CICLO (MENOR A MAYOR) */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Flex justify="space-between" align="center" mb={4}>
                <Heading size="sm" color="#002855">
                  Asignaturas Aprobadas (Ordenadas por Ciclo)
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
                        <Td fontWeight="700" color="#002855">{c.ciclo}</Td>
                        <Td fontWeight="bold" color="blue.600">{c.codigo}</Td>
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
              )}
            </Box>
          </TabPanel>

          {/* PESTAÑA 2: RECOMENDACIONES DEL AGENTE IA */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Asignaciones y Cursos Recomendados por el Agente IA
              </Heading>

              {loading ? (
                <Flex justify="center" p={8}>
                  <Spinner size="lg" color="#002855" thickness="4px" />
                </Flex>
              ) : historyLogs.length === 0 ? (
                <Text fontSize="sm" color="gray.500" textAlign="center" py={6}>
                  No tienes recomendaciones del Agente IA registradas previamente.
                </Text>
              ) : (
                <Accordion allowToggle defaultIndex={[0]}>
                  {historyLogs.map((log, idx) => (
                    <AccordionItem key={idx} border="1px solid" borderColor="gray.200" borderRadius="xl" mb={3} overflow="hidden">
                      <AccordionButton bg="gray.50" _expanded={{ bg: 'blue.50', color: '#002855' }}>
                        <Box flex="1" textAlign="left">
                          <HStack spacing={3}>
                            <Badge colorScheme="purple">{log.solver_utilizado || '4 Algoritmos UPAO'}</Badge>
                            <Text fontSize="xs" fontWeight="bold" color="gray.600">Fecha: {log.created_at || 'Reciente'}</Text>
                          </HStack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel p={4} bg="white">
                        <Text fontSize="xs" whiteSpace="pre-wrap" color="gray.700" lineHeight="1.6">
                          {typeof log.recomendacion === 'object' 
                            ? log.recomendacion.explicacion || JSON.stringify(log.recomendacion, null, 2)
                            : log.recomendacion}
                        </Text>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default HistorialPage;
