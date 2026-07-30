import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
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
  Button,
  useToast,
  Input,
  Checkbox,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { FiCheckSquare, FiRepeat, FiCheckCircle, FiCpu, FiSearch, FiLayers, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import chatService from '../../services/chatService';
import useAuthStore from '../../store/authStore';
import { mallasData } from '../../data/mallasData';
import useChatStore from '../../store/chatStore';

const MotionCard = motion(Card);

const MultimallaPage = () => {
  const [activeMallaTab, setActiveMallaTab] = useState('2025');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { addMessage } = useChatStore();

  // Estado de asignaturas marcadas globalmente en cualquiera de las 4 mallas
  const [selectedCourses, setSelectedCourses] = useState([
    'HUMA-900', 'HUMA-1179', 'ICSI-506', 'CIEN-753', 'ICSI-509', 'HUMA-899', 'CIEN-397'
  ]);
  
  const { userEmail } = useAuthStore();
  const toast = useToast();

  const activePlanCursos = useMemo(() => {
    return mallasData.mallas[activeMallaTab] || mallasData.mallas['2025'];
  }, [activeMallaTab]);

  // Agrupamiento por ciclo para la malla actualmente seleccionada en el Tab
  const cursosPorCiclo = useMemo(() => {
    const grouped = {};
    const filtered = activePlanCursos.filter(c => 
      c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.forEach(curso => {
      const ciclo = curso.ciclo || 'Ciclo Electivo';
      if (!grouped[ciclo]) {
        grouped[ciclo] = [];
      }
      grouped[ciclo].push(curso);
    });

    return grouped;
  }, [activePlanCursos, searchTerm]);

  // Convalidaciones filtradas
  const convalidacionesFiltradas = useMemo(() => {
    return mallasData.convalidaciones.filter(c => 
      c.codAntiguo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cod2025.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.nombre2025.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const toggleCourseSelection = (codigo) => {
    if (selectedCourses.includes(codigo)) {
      setSelectedCourses(selectedCourses.filter(c => c !== codigo));
    } else {
      setSelectedCourses([...selectedCourses, codigo]);
    }
  };

  const handleEvaluateMultimallaForm = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getRecommendation(false);
      
      const cursosTexto = Array.isArray(response.recomendacion)
        ? response.recomendacion
            .map((c, i) => `${i + 1}. ${typeof c === 'object' ? `${c.codigo} - ${c.nombre} (${c.creditos} crd)` : c}`)
            .join('\n')
        : response.recomendacion;

      const cleanExplanation = (response.explicacion || '').replace(/\*/g, '');
      const formattedRecommendation = `${cleanExplanation}\n\n📚 Recomendación de Matrícula Malla 2025 (4 Algoritmos UPAO):\n${cursosTexto}`;

      addMessage({
        content: `He marcado ${selectedCourses.length} asignaturas aprobadas combinando mallas UPAO.\n\nCursos Marcados:\n${selectedCourses.join(', ')}`,
        isBot: false,
      });

      addMessage({
        content: formattedRecommendation,
        isBot: true,
      });

      toast({
        title: 'Recomendación Generada',
        description: `Se procesaron ${selectedCourses.length} asignaturas a través de los 4 Algoritmos. Redirigiendo al Asesor IA...`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => {
        navigate('/app');
      }, 1000);

    } catch (error) {
      toast({
        title: 'Error al obtener recomendación',
        description: error.response?.data?.detail || 'Ocurrió un error al procesar tu selección de asignaturas.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      {/* Cabecera Principal */}
      <Box mb={6} bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Box>
            <HStack spacing={2} mb={1}>
              <Icon as={FiLayers} color="#002855" w={6} h={6} />
              <Heading size="lg" color="#002855">
                Selección de Cursos Multimalla (2009, 2015, 2020, 2025)
              </Heading>
            </HStack>
            <Text fontSize="sm" color="gray.600">
              Navega entre los 4 Planes de Estudio UPAO y marca las materias que aprobaste en cualquier malla. El sistema convalidará todo automáticamente hacia la Malla 2025.
            </Text>
          </Box>

          <Badge colorScheme="purple" p={3} borderRadius="xl" fontSize="xs" boxShadow="sm">
            <HStack spacing={2}>
              <Icon as={FiCheckSquare} w={4} h={4} />
              <Text fontWeight="bold" fontSize="xs">
                {selectedCourses.length} Cursos Marcados en Total
              </Text>
            </HStack>
          </Badge>
        </Flex>
      </Box>

      {/* Selector Principal de las 4 Mallas en Pestañas Superior */}
      <Box bg="white" p={4} borderRadius="2xl" shadow="sm" mb={6} border="1px solid" borderColor="gray.100">
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
            <Text fontWeight="bold" fontSize="xs" color="#002855" textTransform="uppercase" letterSpacing="wider">
              Paso 1: Selecciona la Malla y marca tus asignaturas aprobadas
            </Text>
            <HStack spacing={2}>
              <Icon as={FiSearch} color="gray.400" />
              <Input
                placeholder="Buscar por código o nombre..."
                size="sm"
                w={{ base: '100%', md: '260px' }}
                borderRadius="xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </HStack>
          </Flex>

          <Tabs
            variant="soft-rounded"
            colorScheme="blue"
            index={['2025', '2022', '2019', '2015'].indexOf(activeMallaTab)}
            onChange={(idx) => setActiveMallaTab(['2025', '2022', '2019', '2015'][idx])}
          >
            <TabList overflowX="auto" py={1}>
              <Tab fontWeight="bold" fontSize="xs" px={5}>
                📘 Malla 2025 (Vigente ISIA)
              </Tab>
              <Tab fontWeight="bold" fontSize="xs" px={5}>
                📗 Malla 2022
              </Tab>
              <Tab fontWeight="bold" fontSize="xs" px={5}>
                📙 Malla 2019 / 2020
              </Tab>
              <Tab fontWeight="bold" fontSize="xs" px={5}>
                📕 Malla 2015 / 2009
              </Tab>
            </TabList>
          </Tabs>
        </VStack>
      </Box>

      {/* Grid de Cursos por Ciclo para la Malla Seleccionada */}
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <Heading size="xs" color="gray.700" textTransform="uppercase">
            Asignaturas de la Malla {activeMallaTab} ({activePlanCursos.length} cursos)
          </Heading>
          <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="xs">
            Mostrando Malla {activeMallaTab}
          </Badge>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {Object.entries(cursosPorCiclo).map(([cicloNombre, cursosArr], idx) => (
            <MotionCard
              key={`${activeMallaTab}-${cicloNombre}`}
              shadow="xs"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              <CardHeader bg="#002855" color="white" py={2} px={4} borderTopRadius="xl">
                <Flex justify="space-between" align="center">
                  <Heading size="xs">{cicloNombre}</Heading>
                  <Badge colorScheme="purple" variant="solid" fontSize="xs">
                    {cursosArr.length} cursos
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody p={3}>
                {cursosArr.map((curso, cIdx) => {
                  const isChecked = selectedCourses.includes(curso.codigo);
                  return (
                    <Box
                      key={cIdx}
                      p={3}
                      mb={2}
                      bg={isChecked ? 'purple.50' : 'gray.50'}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={isChecked ? 'purple.300' : 'gray.100'}
                      cursor="pointer"
                      onClick={() => toggleCourseSelection(curso.codigo)}
                      _hover={{ bg: isChecked ? 'purple.100' : 'blue.50' }}
                    >
                      <Flex justify="space-between" align="center" mb={1}>
                        <HStack spacing={2}>
                          <Checkbox
                            isChecked={isChecked}
                            colorScheme="purple"
                            onChange={() => toggleCourseSelection(curso.codigo)}
                          />
                          <Text fontWeight="bold" fontSize="xs" color="#002855">{curso.codigo}</Text>
                        </HStack>
                        <Badge colorScheme={isChecked ? 'purple' : 'green'} fontSize="xs">{curso.creditos} crd</Badge>
                      </Flex>
                      <Text fontSize="xs" fontWeight="600" color="gray.700" ml={6}>{curso.nombre}</Text>
                      {curso.prerrequisitos && curso.prerrequisitos.length > 0 && (
                        <Text fontSize="10px" color="gray.500" mt={1} ml={6}>
                          Prerrequisito: {curso.prerrequisitos.join(', ')}
                        </Text>
                      )}
                    </Box>
                  );
                })}
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Box>

      {/* Botón Flotante / Inferior Principal: "🤖 Obtener Recomendación con 4 Algoritmos" */}
      <Box bg="white" p={6} borderRadius="2xl" shadow="md" textAlign="center" border="1px solid" borderColor="gray.100">
        <VStack spacing={3}>
          <Heading size="sm" color="#002855">
            ¿Listo para calcular tu ruta óptima de nivelación?
          </Heading>
          <Text fontSize="xs" color="gray.600" maxW="600px">
            Has seleccionado <b>{selectedCourses.length} asignaturas aprobadas</b>. Los 4 Algoritmos (Backtracking, Constraint Programming, Prolog y Reglas de Asociación) convalidarán tus materias y calcularán la ruta matemática óptima para tu próximo ciclo.
          </Text>
          <Button
            colorScheme="blue"
            bg="#002855"
            size="lg"
            leftIcon={<FiCpu size={22} />}
            isLoading={isLoading}
            onClick={handleEvaluateMultimallaForm}
            px={10}
            py={6}
            borderRadius="xl"
            shadow="lg"
            fontSize="md"
            fontWeight="bold"
            _hover={{ bg: '#001d3d', transform: 'scale(1.02)' }}
          >
            🤖 Obtener Recomendación (4 Algoritmos UPAO)
          </Button>
        </VStack>
      </Box>

      <Divider my={8} />

      {/* Sección Secundaria: Tabla de Convalidaciones Automáticas */}
      <Box bg="white" p={6} borderRadius="2xl" shadow="sm" border="1px solid" borderColor="gray.100">
        <HStack spacing={2} mb={3}>
          <Icon as={FiRepeat} color="#002855" w={5} h={5} />
          <Heading size="sm" color="#002855">
            Matriz Completa de Equivalencias hacia la Malla 2025
          </Heading>
        </HStack>
        <Text fontSize="xs" color="gray.600" mb={4}>
          Esta tabla muestra la convalidación automática de asignaturas históricas pertenecientes a mallas anteriores hacia el Plan de Estudio 2025.
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg="gray.50">
              <Tr>
                <Th fontSize="10px">Malla Origen</Th>
                <Th fontSize="10px">Código Antiguo</Th>
                <Th fontSize="10px">Asignatura Convalidada Malla 2025</Th>
                <Th fontSize="10px">Estado de Convalidación</Th>
              </Tr>
            </Thead>
            <Tbody>
              {convalidacionesFiltradas.map((eq, idx) => (
                <Tr key={idx}>
                  <Td><Badge colorScheme="purple" fontSize="10px">{eq.planAntiguo || 'Histórico'}</Badge></Td>
                  <Td fontWeight="600" color="gray.800" fontSize="xs">{eq.codAntiguo}</Td>
                  <Td fontWeight="600" color="#002855" fontSize="xs">{eq.cod2025} - {eq.nombre2025}</Td>
                  <Td>
                    <Badge colorScheme="green" fontSize="10px">
                      <HStack spacing={1}>
                        <Icon as={FiCheckCircle} />
                        <Text>Convalidado Automático</Text>
                      </HStack>
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Container>
  );
};

export default MultimallaPage;
