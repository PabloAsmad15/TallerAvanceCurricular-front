import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  Select,
  Button,
  useToast,
  Input,
  Checkbox,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { FiGrid, FiRepeat, FiCheckCircle, FiLayers, FiSend, FiCpu, FiCheckSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SendEmailModal from '../../components/SendEmailModal';
import chatService from '../../services/chatService';
import useAuthStore from '../../store/authStore';
import { mallasData } from '../../data/mallasData';

const MotionCard = motion(Card);

const MultimallaPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('2025');
  const [isMultimallaMode, setIsMultimallaMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para los cursos seleccionados en el Formulario Multimalla
  const [selectedCourses, setSelectedCourses] = useState([
    'HUMA-900', 'HUMA-1179', 'ICSI-506', 'CIEN-753', 'ICSI-509'
  ]);
  
  const { userEmail } = useAuthStore();
  const toast = useToast();

  const activePlanCursos = useMemo(() => {
    const plan = isMultimallaMode ? '2025' : selectedPlan;
    return mallasData.mallas[plan] || mallasData.mallas['2025'];
  }, [selectedPlan, isMultimallaMode]);

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

      const report = `=== EVIDENCIA DE EVALUACIÓN MULTIMALLA (4 ALGORITMOS UPAO) ===\nAlumno: ${userEmail || 'Estudiante UPAO'}\nCursos Aprobados Seleccionados (${selectedCourses.length}):\n${selectedCourses.join(', ')}\n\n${response.explicacion}\n\n📚 Recomendación de Matrícula Malla 2025:\n${cursosTexto}`;

      setEmailContent(report);
      setIsModalOpen(true);

      toast({
        title: 'Evaluación Multimalla Completada',
        description: `Se evaluaron ${selectedCourses.length} asignaturas seleccionadas con los 4 Algoritmos Inteligentes.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al evaluar formulario',
        description: error.response?.data?.detail || 'Ocurrió un error al procesar el formulario multimalla.',
        status: 'error',
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Flex justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Box>
            <Heading size="lg" color="#002855" mb={1}>
              Formulario y Convalidador Multimalla UPAO
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Selecciona los cursos aprobados de tus mallas anteriores (2015, 2019, 2022) en el formulario interactivo para que el Agente IA evalúe la convalidación hacia la Malla 2025.
            </Text>
          </Box>
          <Button
            colorScheme="blue"
            bg="#002855"
            size="md"
            leftIcon={<FiCpu />}
            isLoading={isLoading}
            onClick={handleEvaluateMultimallaForm}
            _hover={{ bg: '#001d3d' }}
          >
            Evaluar Convalidación con Agente IA
          </Button>
        </Flex>
      </Box>

      {/* Control y Selector de Modo */}
      <Box bg="white" p={4} borderRadius="xl" shadow="sm" mb={6} border="1px solid" borderColor="gray.100">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={4}>
          <HStack spacing={3}>
            <Icon as={FiLayers} color="#002855" w={6} h={6} />
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="#002855">
                Modo Multimalla: {isMultimallaMode ? 'Formulario Interactivo Activo' : `Vista de Malla ${selectedPlan}`}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {selectedCourses.length} asignaturas marcadas en el formulario multimalla.
              </Text>
            </Box>
          </HStack>

          <HStack spacing={3} wrap="wrap">
            <Input
              placeholder="Buscar asignatura o código..."
              size="sm"
              w="200px"
              borderRadius="md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Button
              size="sm"
              variant={!isMultimallaMode ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => setIsMultimallaMode(false)}
            >
              Vista Malla Única
            </Button>
            <Button
              size="sm"
              variant={isMultimallaMode ? 'solid' : 'outline'}
              colorScheme="purple"
              leftIcon={<FiCheckSquare />}
              onClick={() => setIsMultimallaMode(true)}
            >
              Formulario Multimalla
            </Button>

            {!isMultimallaMode && (
              <Select
                maxW="140px"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                fontWeight="bold"
                size="sm"
                borderRadius="md"
              >
                <option value="2025">Malla 2025</option>
                <option value="2022">Malla 2022</option>
                <option value="2019">Malla 2019</option>
                <option value="2015">Malla 2015</option>
              </Select>
            )}
          </HStack>
        </Flex>

        {isMultimallaMode && (
          <Box mt={3} p={4} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
            <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
              <Text fontSize="xs" color="purple.900" fontWeight="600">
                📝 FORMULARIO INTERACTIVO MULTIMALLA: Marca las casillas de las asignaturas aprobadas en tus mallas previas (2015/2019/2022) y presiona "Evaluar Convalidación".
              </Text>
              <Badge colorScheme="purple" fontSize="xs">
                {selectedCourses.length} seleccionados
              </Badge>
            </Flex>
          </Box>
        )}
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiGrid} /><Text>Formulario y Cursos ({isMultimallaMode ? 'Multimalla' : `Malla ${selectedPlan}`})</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiRepeat} /><Text>Tabla de Convalidaciones</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* VISTA DE CURSOS Y FORMULARIO POR CICLOS */}
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {Object.entries(cursosPorCiclo).map(([cicloNombre, cursosArr], idx) => (
                <MotionCard
                  key={cicloNombre}
                  shadow="xs"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="xl"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <CardHeader bg="#002855" color="white" py={2} px={4} borderTopRadius="xl">
                    <Flex justify="space-between" align="center">
                      <Heading size="xs">{cicloNombre}</Heading>
                      <Badge colorScheme={isMultimallaMode ? 'purple' : 'blue'} variant="solid" fontSize="xs">
                        {cursosArr.length} cursos
                      </Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody p={4}>
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
                          onClick={() => isMultimallaMode && toggleCourseSelection(curso.codigo)}
                          _hover={{ bg: isChecked ? 'purple.100' : 'blue.50' }}
                        >
                          <Flex justify="space-between" align="center" mb={1}>
                            <HStack spacing={2}>
                              {isMultimallaMode && (
                                <Checkbox
                                  isChecked={isChecked}
                                  colorScheme="purple"
                                  onChange={() => toggleCourseSelection(curso.codigo)}
                                />
                              )}
                              <Text fontWeight="bold" fontSize="xs" color="#002855">{curso.codigo}</Text>
                            </HStack>
                            <Badge colorScheme={isChecked ? 'purple' : 'green'} fontSize="xs">{curso.creditos} crd</Badge>
                          </Flex>
                          <Text fontSize="xs" fontWeight="600" color="gray.700" ml={isMultimallaMode ? 6 : 0}>{curso.nombre}</Text>
                          {curso.prerrequisitos && curso.prerrequisitos.length > 0 && (
                            <Text fontSize="10px" color="gray.500" mt={1} ml={isMultimallaMode ? 6 : 0}>
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

            {isMultimallaMode && (
              <Box mt={6} textAlign="center">
                <Button
                  colorScheme="purple"
                  size="lg"
                  leftIcon={<FiCpu />}
                  isLoading={isLoading}
                  onClick={handleEvaluateMultimallaForm}
                  px={8}
                  borderRadius="xl"
                  shadow="md"
                  _hover={{ scale: 1.02 }}
                >
                  🤖 Evaluar Convalidación y Generar Recomendación IA
                </Button>
              </Box>
            )}
          </TabPanel>

          {/* TABLA DE CONVALIDACIONES COMPLETA */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Matriz Completa de Equivalencias y Convalidaciones hacia Malla 2025
              </Heading>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Malla Origen</Th>
                    <Th>Código Antiguo</Th>
                    <Th>Asignatura Convalidada Malla 2025</Th>
                    <Th>Estado de Convalidación</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {convalidacionesFiltradas.map((eq, idx) => (
                    <Tr key={idx}>
                      <Td><Badge colorScheme="purple">{eq.planAntiguo || 'Histórico'}</Badge></Td>
                      <Td fontWeight="600" color="gray.800">{eq.codAntiguo}</Td>
                      <Td fontWeight="600" color="#002855">{eq.cod2025} - {eq.nombre2025}</Td>
                      <Td><Badge colorScheme="green"><HStack spacing={1}><Icon as={FiCheckCircle} /><Text>Convalidado Automático</Text></HStack></Badge></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <SendEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialContent={emailContent}
      />
    </Container>
  );
};

export default MultimallaPage;
