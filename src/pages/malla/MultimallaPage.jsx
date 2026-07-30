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
} from '@chakra-ui/react';
import { FiBookOpen, FiGrid, FiRepeat, FiCheckCircle } from 'react-icons/fi';

const sampleMalla2025 = [
  { ciclo: 'Ciclo I', cursos: [{ cod: 'HUMA-101', nombre: 'Lenguaje y Redacción', cred: 4 }, { cod: 'MAT-101', nombre: 'Matemática Básica', cred: 4 }, { cod: 'IS-101', nombre: 'Introducción a la Ing. de Software', cred: 3 }] },
  { ciclo: 'Ciclo II', cursos: [{ cod: 'MAT-102', nombre: 'Cálculo I', cred: 4, prereq: ['MAT-101'] }, { cod: 'IS-102', nombre: 'Algoritmos y Programación', cred: 4, prereq: ['IS-101'] }] },
  { ciclo: 'Ciclo III', cursos: [{ cod: 'IS-201', nombre: 'Estructura de Datos', cred: 4, prereq: ['IS-102'] }, { cod: 'MAT-201', nombre: 'Cálculo II', cred: 4, prereq: ['MAT-102'] }] },
  { ciclo: 'Ciclo IV', cursos: [{ cod: 'IS-202', nombre: 'Bases de Datos I', cred: 4, prereq: ['IS-201'] }, { cod: 'IS-203', nombre: 'Ingeniería de Requerimientos', cred: 3 }] },
  { ciclo: 'Ciclo V', cursos: [{ cod: 'IS-301', nombre: 'Bases de Datos II', cred: 4, prereq: ['IS-202'] }, { cod: 'IS-302', nombre: 'Desarrollo Web', cred: 4, prereq: ['IS-202'] }] },
  { ciclo: 'Ciclo VI', cursos: [{ cod: 'IS-303', nombre: 'Arquitectura de Software', cred: 4, prereq: ['IS-302'] }, { cod: 'IS-304', nombre: 'Inteligencia Artificial', cred: 4, prereq: ['IS-201'] }] },
];

const equivalenciasSample = [
  { antiguoCod: 'CC-101', antiguoNom: 'Fundamentos de Programación (Malla 2015)', nuevoCod: 'IS-102', nuevoNom: 'Algoritmos y Programación (Malla 2025)' },
  { antiguoCod: 'CC-201', antiguoNom: 'Base de Datos Avanzada (Malla 2019)', nuevoCod: 'IS-301', nuevoNom: 'Bases de Datos II (Malla 2025)' },
  { antiguoCod: 'CC-305', antiguoNom: 'Sistemas Inteligentes (Malla 2022)', nuevoCod: 'IS-304', nuevoNom: 'Inteligencia Artificial (Malla 2025)' },
];

const MultimallaPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('2025');

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={6}>
        <Heading size="lg" color="#002855" mb={1}>
          Visualizador Multimalla UPAO
        </Heading>
        <Text fontSize="sm" color="gray.600">
          Explora los planes de estudio (2015, 2019, 2022, 2025) y las reglas de convalidación automática.
        </Text>
      </Box>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList mb="1em">
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiGrid} /><Text>Planes de Estudio</Text></HStack></Tab>
          <Tab fontWeight="bold"><HStack spacing={2}><Icon as={FiRepeat} /><Text>Tabla de Convalidaciones</Text></HStack></Tab>
        </TabList>

        <TabPanels>
          {/* Panel de Planes de Estudio */}
          <TabPanel px={0}>
            <Flex justify="space-between" align="center" mb={6} bg="white" p={4} borderRadius="xl" shadow="sm">
              <HStack spacing={3}>
                <Icon as={FiBookOpen} color="#002855" w={5} h={5} />
                <Text fontWeight="bold" fontSize="sm" color="#002855">Plan de Estudios Seleccionado:</Text>
              </HStack>
              <Select
                maxW="200px"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                fontWeight="bold"
                size="sm"
                borderRadius="md"
              >
                <option value="2025">Malla 2025 (Vigente)</option>
                <option value="2022">Malla 2022</option>
                <option value="2019">Malla 2019</option>
                <option value="2015">Malla 2015</option>
              </Select>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {sampleMalla2025.map((c, idx) => (
                <Card key={idx} shadow="xs" border="1px solid" borderColor="gray.200" borderRadius="xl">
                  <CardHeader bg="#002855" color="white" py={2} px={4} borderTopRadius="xl">
                    <Flex justify="space-between" align="center">
                      <Heading size="xs">{c.ciclo}</Heading>
                      <Badge colorScheme="blue" variant="solid" fontSize="xs">Plan {selectedPlan}</Badge>
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

          {/* Panel de Tabla de Convalidaciones */}
          <TabPanel px={0}>
            <Box bg="white" p={6} borderRadius="xl" shadow="sm" border="1px solid" borderColor="gray.100">
              <Heading size="sm" color="#002855" mb={4}>
                Mapeo de Equivalencias hacia la Malla 2025
              </Heading>
              <Table variant="simple" size="sm">
                <Thead bg="gray.50">
                  <Tr>
                    <Th>Código & Asignatura Origen</Th>
                    <Th>Equivalencia Directa Malla 2025</Th>
                    <Th>Estado de Convalidación</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {equivalenciasSample.map((eq, idx) => (
                    <Tr key={idx}>
                      <Td fontWeight="600" color="gray.800">{eq.antiguoCod} - {eq.antiguoNom}</Td>
                      <Td fontWeight="600" color="#002855">{eq.nuevoCod} - {eq.nuevoNom}</Td>
                      <Td><Badge colorScheme="green"><HStack spacing={1}><Icon as={FiCheckCircle} /><Text>Automático</Text></HStack></Badge></Td>
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

export default MultimallaPage;
