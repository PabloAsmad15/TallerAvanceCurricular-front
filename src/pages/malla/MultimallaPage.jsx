import { useState } from 'react';
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
  VStack,
} from '@chakra-ui/react';
import { FiBookOpen, FiGrid, FiRepeat, FiCheckCircle, FiMail, FiLayers, FiSend } from 'react-icons/fi';
import SendEmailModal from '../../components/SendEmailModal';
import chatService from '../../services/chatService';
import useAuthStore from '../../store/authStore';

const sampleMalla2025 = [
  { ciclo: 'Ciclo I', cursos: [{ cod: 'HUMA-101', nombre: 'Lenguaje y Redacción', cred: 4 }, { cod: 'MAT-101', nombre: 'Matemática Básica', cred: 4 }, { cod: 'IS-101', nombre: 'Introducción a la Ing. de Software', cred: 3 }] },
  { ciclo: 'Ciclo II', cursos: [{ cod: 'MAT-102', nombre: 'Cálculo I', cred: 4, prereq: ['MAT-101'] }, { cod: 'IS-102', nombre: 'Algoritmos y Programación', cred: 4, prereq: ['IS-101'] }] },
  { ciclo: 'Ciclo III', cursos: [{ cod: 'IS-201', nombre: 'Estructura de Datos', cred: 4, prereq: ['IS-102'] }, { cod: 'MAT-201', nombre: 'Cálculo II', cred: 4, prereq: ['MAT-102'] }] },
  { ciclo: 'Ciclo IV', cursos: [{ cod: 'IS-202', nombre: 'Bases de Datos I', cred: 4, prereq: ['IS-201'] }, { cod: 'IS-203', nombre: 'Ingeniería de Requerimientos', cred: 3 }] },
  { ciclo: 'Ciclo V', cursos: [{ cod: 'IS-301', nombre: 'Bases de Datos II', cred: 4, prereq: ['IS-202'] }, { cod: 'IS-302', nombre: 'Desarrollo Web', cred: 4, prereq: ['IS-202'] }] },
  { ciclo: 'Ciclo VI', cursos: [{ cod: 'IS-303', nombre: 'Arquitectura de Software', cred: 4, prereq: ['IS-302'] }, { cod: 'IS-304', nombre: 'Inteligencia Artificial', cred: 4, prereq: ['IS-201'] }] },
];

const equivalenciasSample = [
  { antiguoCod: 'CC-101', antiguoNom: 'Fundamentos de Programación (Malla 2015)', nuevoCod: 'IS-102', nuevoNom: 'Algoritmos y Programación (Malla 2025)', estado: 'Convalidado Automático' },
  { antiguoCod: 'CC-201', antiguoNom: 'Base de Datos Avanzada (Malla 2019)', nuevoCod: 'IS-301', nuevoNom: 'Bases de Datos II (Malla 2025)', estado: 'Convalidado Automático' },
  { antiguoCod: 'CC-305', antiguoNom: 'Sistemas Inteligentes (Malla 2022)', nuevoCod: 'IS-304', nuevoNom: 'Inteligencia Artificial (Malla 2025)', estado: 'Convalidado Automático' },
];

const MultimallaPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('2022');
  const [isMultimallaMode, setIsMultimallaMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { userEmail } = useAuthStore();
  const toast = useToast();

  const handleGenerateRecommendation = async () => {
    setIsLoading(true);
    try {
      const response = await chatService.getRecommendation(false);
      
      const cursosTexto = Array.isArray(response.recomendacion)
        ? response.recomendacion
            .map((c, i) => `${i + 1}. ${typeof c === 'object' ? `${c.codigo} - ${c.nombre} (${c.creditos} crd)` : c}`)
            .join('\n')
        : response.recomendacion;

      const fullReport = `=== EVIDENCIA DE RECOMENDACIÓN CURRICULAR UPAO ===\nAlumno: ${userEmail || 'Estudiante UPAO'}\nModo: ${isMultimallaMode ? 'MULTIMALLA (Varias Mallas)' : `Malla ${selectedPlan}`}\n\n${response.explicacion}\n\n📚 Cursos Sugeridos para Matrícula Malla 2025:\n${cursosTexto}`;

      setEmailContent(fullReport);
      setIsModalOpen(true);
    } catch (error) {
      toast({
        title: 'Error al generar informe',
        description: error.response?.data?.detail || 'No se pudo generar la recomendación multimalla.',
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
              Visualizador y Convalidador Multimalla UPAO
            </Heading>
            <Text fontSize="sm" color="gray.600">
              Convalida tus asignaturas aprobadas de mallas anteriores (2015, 2019, 2022) o de múltiples reintegros hacia la Malla 2025.
            </Text>
          </Box>
          <Button
            colorScheme="brand"
            bg="#002855"
            size="md"
            leftIcon={<FiSend />}
            isLoading={isLoading}
            onClick={handleGenerateRecommendation}
            _hover={{ bg: '#001d3d' }}
          >
            Enviar Evidencia por Correo
          </Button>
        </Flex>
      </Box>

      {/* Selector de Modo de Malla / Multimalla */}
      <Box bg="white" p={4} borderRadius="xl" shadow="sm" mb={6} border="1px solid" borderColor="gray.100">
        <Flex direction={{ base: 'column', md: 'row' }} justify="space-between" align={{ base: 'start', md: 'center' }} gap={4}>
          <HStack spacing={3}>
            <Icon as={FiLayers} color="#002855" w={6} h={6} />
            <Box>
              <Text fontWeight="bold" fontSize="sm" color="#002855">
                Configuración de Malla del Estudiante:
              </Text>
              <Text fontSize="xs" color="gray.500">
                Selecciona tu plan de origen o activa el Modo Multimalla si tienes cursos aprobados de distintas épocas.
              </Text>
            </Box>
          </HStack>

          <HStack spacing={3}>
            <Button
              size="sm"
              variant={isMultimallaMode ? 'outline' : 'solid'}
              colorScheme="blue"
              onClick={() => setIsMultimallaMode(false)}
            >
              Malla Única
            </Button>
            <Button
              size="sm"
              variant={isMultimallaMode ? 'solid' : 'outline'}
              colorScheme="purple"
              leftIcon={<FiLayers />}
              onClick={() => setIsMultimallaMode(true)}
            >
              Modo Multimalla
            </Button>

            {!isMultimallaMode && (
              <Select
                maxW="180px"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                fontWeight="bold"
                size="sm"
                borderRadius="md"
              >
                <option value="2022">Malla 2022</option>
                <option value="2019">Malla 2019</option>
                <option value="2015">Malla 2015</option>
                <option value="2025">Malla 2025</option>
              </Select>
            )}
          </HStack>
        </Flex>

        {isMultimallaMode && (
          <Box mt={3} p={3} bg="purple.50" borderRadius="lg" border="1px solid" borderColor="purple.200">
            <Text fontSize="xs" color="purple.800" fontWeight="600">
              ✨ MODO MULTIMALLA ACTIVO: El sistema está procesando tus cursos aprobados de diferentes mallas (2015 + 2019 + 2022) y convalidándolos a la Malla 2025 vigente.
            </Text>
          </Box>
        )}
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiGrid} /><Text>Plan de Estudios Malla 2025</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiRepeat} /><Text>Tabla de Convalidaciones</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {sampleMalla2025.map((c, idx) => (
                <Card key={idx} shadow="xs" border="1px solid" borderColor="gray.200" borderRadius="xl">
                  <CardHeader bg="#002855" color="white" py={2} px={4} borderTopRadius="xl">
                    <Flex justify="space-between" align="center">
                      <Heading size="xs">{c.ciclo}</Heading>
                      <Badge colorScheme={isMultimallaMode ? 'purple' : 'blue'} variant="solid" fontSize="xs">
                        {isMultimallaMode ? 'Multimalla' : `Origen ${selectedPlan}`}
                      </Badge>
                    </Flex>
                  </CardHeader>
                  <CardBody p={4}>
                    {c.cursos.map((curso, cIdx) => (
                      <Box key={cIdx} p={3} mb={2} bg="gray.50" borderRadius="lg" border="1px solid" borderColor="gray.100">
                        <Flex justify="space-between" align="center" mb={1}>
                          <Text fontWeight="bold" fontSize="xs" color="#002855">{curso.cod}</Text>
                          <Badge colorScheme="green" fontSize="xs">{curso.cred} crd</Badge>
                        </Flex>
                        <Text fontSize="xs" fontWeight="500" color="gray.700">{curso.nombre}</Text>
                        {curso.prereq && (
                          <Text fontSize="10px" color="gray.500" mt={1}>
                            Prerrequisito: {curso.prereq.join(', ')}
                          </Text>
                        )}
                      </Box>
                    ))}
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </TabPanel>

          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Matriz de Equivalencias y Convalidaciones hacia la Malla 2025
              </Heading>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Asignatura Origen (Plan Histórico)</Th>
                    <Th>Equivalencia Convalidada Malla 2025</Th>
                    <Th>Estado de Convalidación</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {equivalenciasSample.map((eq, idx) => (
                    <Tr key={idx}>
                      <Td fontWeight="600" color="gray.800">{eq.antiguoCod} - {eq.antiguoNom}</Td>
                      <Td fontWeight="600" color="#002855">{eq.nuevoCod} - {eq.nuevoNom}</Td>
                      <Td><Badge colorScheme="green"><HStack spacing={1}><Icon as={FiCheckCircle} /><Text>{eq.estado}</Text></HStack></Badge></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal para enviar evidencia oficial por correo */}
      <SendEmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialContent={emailContent}
      />
    </Container>
  );
};

export default MultimallaPage;
