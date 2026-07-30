import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  HStack,
  Badge,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMessageSquare, FiGrid, FiClock, FiShield, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, userRole, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="#002855" px={6} py={3} color="white" boxShadow="md">
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        {/* Logo de Tesis & Marca UPAO */}
        <HStack spacing={3} cursor="pointer" onClick={() => navigate('/app')}>
          <Image
            src="/logo.png"
            h="38px"
            w="38px"
            objectFit="cover"
            borderRadius="md"
            border="1px solid"
            borderColor="whiteAlpha.400"
            alt="UPAO Logo"
          />
          <Box>
            <Heading size="sm" fontWeight="bold" letterSpacing="tight">
              Asesor Curricular IA
            </Heading>
            <Text fontSize="xs" color="whiteAlpha.800">
              Universidad Privada Antenor Orrego
            </Text>
          </Box>
        </HStack>

        {/* Navegación por Secciones: Asesor Virtual | Multimalla | Historial | Admin */}
        <HStack spacing={2}>
          <Button
            size="sm"
            variant={location.pathname.startsWith('/app') ? 'solid' : 'ghost'}
            bg={location.pathname.startsWith('/app') ? 'whiteAlpha.300' : 'transparent'}
            color="white"
            leftIcon={<FiMessageSquare />}
            onClick={() => navigate('/app')}
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Asesor IA
          </Button>

          <Button
            size="sm"
            variant={location.pathname.startsWith('/malla') ? 'solid' : 'ghost'}
            bg={location.pathname.startsWith('/malla') ? 'whiteAlpha.300' : 'transparent'}
            color="white"
            leftIcon={<FiGrid />}
            onClick={() => navigate('/malla')}
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Multimalla
          </Button>

          <Button
            size="sm"
            variant={location.pathname.startsWith('/historial') ? 'solid' : 'ghost'}
            bg={location.pathname.startsWith('/historial') ? 'whiteAlpha.300' : 'transparent'}
            color="white"
            leftIcon={<FiClock />}
            onClick={() => navigate('/historial')}
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Mi Historial
          </Button>

          {userRole === 'admin' && (
            <Button
              size="sm"
              variant={location.pathname.startsWith('/admin') ? 'solid' : 'ghost'}
              bg={location.pathname.startsWith('/admin') ? 'whiteAlpha.300' : 'transparent'}
              color="white"
              leftIcon={<FiShield />}
              onClick={() => navigate('/admin/dashboard')}
              _hover={{ bg: 'whiteAlpha.300' }}
            >
              Panel Admin
            </Button>
          )}

          {/* Menú de Usuario */}
          <Menu>
            <MenuButton
              as={Button}
              size="sm"
              variant="outline"
              borderColor="whiteAlpha.400"
              color="white"
              rightIcon={<FiChevronDown />}
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
              ml={2}
            >
              <HStack spacing={2}>
                <Icon as={FiUser} />
                <Text fontSize="xs" display={{ base: 'none', md: 'inline' }}>
                  {userEmail || 'Estudiante'}
                </Text>
                {userRole === 'admin' && (
                  <Badge colorScheme="purple" fontSize="0.6em">
                    ADMIN
                  </Badge>
                )}
              </HStack>
            </MenuButton>
            <MenuList color="gray.800" shadow="xl" borderRadius="xl">
              <Box px={4} py={2}>
                <Text fontWeight="bold" fontSize="xs">
                  Sesión Activa
                </Text>
                <Text fontSize="xs" color="gray.500" isTruncated maxW="200px">
                  {userEmail || 'pasmadm1@upao.edu.pe'}
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem
                icon={<FiLogOut color="red" />}
                color="red.600"
                fontWeight="600"
                fontSize="xs"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
