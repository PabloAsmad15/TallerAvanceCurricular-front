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
  Select,
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
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { FiGrid, FiRepeat, FiCheckCircle, FiLayers, FiSend, FiCpu, FiCheckSquare, FiSearch, FiHelpCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SendEmailModal from '../../components/SendEmailModal';
import chatService from '../../services/chatService';
import useAuthStore from '../../store/authStore';
import { mallasData } from '../../data/mallasData';

const MotionCard = motion(Card);

const MultimallaPage = () => {
  // Modalidad: 'UNICA' o 'MULTIMALLA'
  const [modalidad, setModalidad] = useState('UNICA'); 
  const [selectedPlan, setSelectedPlan] = useState('2025');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado de cursos aprobados marcados por el estudiante
  const [selectedCourses, setSelectedCourses] = useState([
    'HUMA-900', 'HUMA-1179', 'ICSI-506', 'CIEN-753', 'ICSI-509'
  ]);
  
  const { userEmail } = useAuthStore();
  const toast = useToast();

  const isMultimallaMode = modalidad === 'MULTIMALLA';

  // Asignaturas activas a mostrar
  const activePlanCursos = useMemo(() => {
    const plan = isMultimallaMode ? '2025' : selectedPlan;
    return mallasData.mallas[plan] || mallasData.mallas['2025'];
  }, [selectedPlan, isMultimallaMode]);

  // Agrupamiento por ciclo con filtro de búsqueda
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

      const report = `=== EVIDENCIA DE EVALUACIÓN ACADÉMICA UPAO ===\nAlumno: ${userEmail || 'Estudiante UPAO'}\nModalidad: ${isMultimallaMode ? 'MULTIMALLA (Varias Mallas)' : `Malla Única ${selectedPlan}`}\nCursos Aprobados Seleccionados (${selectedCourses.length}):\n${selectedCourses.join(', ')}\n\n${response.explicacion}\n\n📚 Recomendación de Matrícula Malla 2025:\n${cursosTexto}`;

      setEmailContent(report);
      setIsModalOpen(true);

      toast({
        title: 'Evaluación Completada',
        description: `Se evaluaron ${selectedCourses.length} asignaturas seleccionadas mediante los 4 Algoritmos Inteligentes.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error al evaluar selección',
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
            <Heading size="lg" color="#002855" mb={1}>
              Selección de Cursos Aprobados y Convalidación
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Marca las asignaturas que aprobaste en tus mallas académicas para que el Agente de 4 Algoritmos genere tu recomendación.
            </Text>
          </Box>
          <Badge colorScheme="purple" p={3} borderRadius="xl" fontSize="xs">
            <HStack spacing={2}>
              <Icon as={FiCheckSquare} />
              <Text fontWeight="bold">{selectedCourses.length} Cursos Marcados</Text>
            </HStack>
          </Badge>
        </Flex>
      </Box>

      {/* PASO 1: Selector Intuitivo de Modalidad */}
      <Box bg="white" p={6} borderRadius="2xl" shadow="sm" mb={6} border="1px solid" borderColor="gray.100">
        <VStack align="stretch" spacing={4}>
          <Text fontWeight="bold" fontSize="sm" color="#002855">
            PASO 1: Selecciona tu Modalidad de Origen Curricular
          </Text>

          <RadioGroup value={modalidad} onChange={setModalidad}>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6}>
              <Box
                p={4}
                borderRadius="xl"
                border="2px solid"
                borderColor={modalidad === 'UNICA' ? '#002855' : 'gray.200'}
                bg={modalidad === 'UNICA' ? 'blue.50' : 'gray.50'}
                flex={1}
                cursor="pointer"
                onClick={() => setModalidad('UNICA')}
              >
                <Radio value="UNICA" colorScheme="blue" mb={2}>
                  <Text fontWeight="bold" fontSize="sm" color="#002855">
                    Modalidad Malla Única
                  </Text>
                </Radio>
                <Text fontSize="xs" color="gray.600" ml={6}>
                  Si todos tus cursos aprobados corresponden a una sola malla oficial (2015, 2019, 2022 o 2025).
                </Text>
              </Box>

              <Box
                p={4}
                borderRadius="xl"
                border="2px solid"
                borderColor={modalidad === 'MULTIMALLA' ? 'purple.500' : 'gray.200'}
                bg={modalidad === 'MULTIMALLA' ? 'purple.50' : 'gray.50'}
                flex={1}
                cursor="pointer"
                onClick={() => setModalidad('MULTIMALLA')}
              >
                <Radio value="MULTIMALLA" colorScheme="purple" mb={2}>
                  <Text fontWeight="bold" fontSize="sm" color="purple.900">
                    Modo Multimalla (Reintegros / Histórico)
                  </Text>
                </Radio>
                <Text fontSize="xs" color="purple.800" ml={6}>
                  Si dejaste la universidad y regresaste, aprobando cursos de distintas mallas en diferentes épocas.
                </Text>
              </Box>
            </Stack>
          </RadioGroup>

          {/* Sub-selector de Malla Específica si es Malla Única */}
          {modalidad === 'UNICA' && (
            <Flex align="center" gap={3} pt={2}>
              <Text fontSize="xs" fontWeight="bold" color="gray.700">
                Seleccionar Plan Específico:
              </Text>
              <Select
                maxW="180px"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                fontWeight="bold"
                size="sm"
                borderRadius="lg"
              >
                <option value="2025">Malla 2025 (Vigente)</option>
                <option value="2022">Malla 2022</option>
                <option value="2019">Malla 2019</option>
                <option value="2015">Malla 2015</option>
              </Select>
            </Flex>
          )}
        </VStack>
      </Box>

      {/* PASO 2: Buscador y Selector de Asignaturas */}
      <Box bg="white" p={4} borderRadius="2xl" shadow="sm" mb={6} border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Text fontWeight="bold" fontSize="sm" color="#002855">
            PASO 2: Marca los Cursos que ya Aprobaste ({activePlanCursos.length} asignaturas)
          </Text>
          <HStack spacing={2}>
            <Icon as={FiSearch} color="gray.400" />
            <Input
              placeholder="Buscar curso por nombre o código..."
              size="sm"
              w={{ base: '100%', md: '280px' }}
              borderRadius="xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </HStack>
        </Flex>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiCheckSquare} /><Text>Formulario de Selección ({modalidad === 'MULTIMALLA' ? 'Multimalla' : `Malla ${selectedPlan}`})</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiRepeat} /><Text>Tabla de Convalidaciones</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* TAB 1: FORMULARIO DE SELECCIÓN POR CICLOS */}
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

            {/* BOTÓN FLOTANTE Y PRINCIPAL DE EVALUACIÓN */}
            <Box mt={8} textAlign="center">
              <Button
                colorScheme="blue"
                bg="#002855"
                size="lg"
                leftIcon={<FiCpu size={22} />}
                isLoading={isLoading}
                onClick={handleEvaluateMultimallaForm}
                px={10}
                py={7}
                borderRadius="2xl"
                shadow="xl"
                fontSize="md"
                fontWeight="bold"
                _hover={{ bg: '#001d3d', scale: 1.03 }}
              >
                🤖 Evaluar Convalidación y Generar Recomendación IA
              </Button>
            </Box>
          </TabPanel>

          {/* TAB 2: TABLA DE CONVALIDACIONES COMPLETA */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Matriz Completa de Equivalencias y Convalidaciones hacia la Malla 2025
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
