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
import { FiMessageSquare, FiGrid, FiClock, FiCheckSquare, FiShield, FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail, userRole, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box className="glass-navbar" sticky="top" zIndex={1000} px={6} py={3} color="white" boxShadow="lg" borderBottom="1px solid rgba(255,255,255,0.1)">
      <Flex maxW="container.xl" mx="auto" align="center" justify="space-between">
        {/* Logo Minimalista de Tesis & Marca UPAO */}
        <HStack spacing={3} cursor="pointer" onClick={() => navigate('/app')}>
          <MotionFlex
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Image
              src="/logo.svg"
              h="38px"
              w="38px"
              objectFit="contain"
              alt="UPAO AI Logo"
            />
          </MotionFlex>
          <Box>
            <Heading size="sm" fontWeight="700" letterSpacing="tight" bgGradient="linear(to-r, white, blue.100)" bgClip="text">
              Asesor Curricular IA
            </Heading>
            <Text fontSize="xs" color="whiteAlpha.800" fontWeight="500">
              Universidad Privada Antenor Orrego
            </Text>
          </Box>
        </HStack>

        {/* Navegación por Secciones: Asesor IA | Multimalla | Mis Cursos | Historial | Admin */}
        <HStack spacing={2}>
          <MotionBox whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
            <Button
              size="sm"
              variant={location.pathname.startsWith('/app') ? 'solid' : 'ghost'}
              bg={location.pathname.startsWith('/app') ? 'whiteAlpha.300' : 'transparent'}
              color="white"
              borderRadius="lg"
              leftIcon={<FiMessageSquare />}
              onClick={() => navigate('/app')}
              _hover={{ bg: 'whiteAlpha.300', shadow: 'md' }}
            >
              Asesor IA
            </Button>
          </MotionBox>

          <MotionBox whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
            <Button
              size="sm"
              variant={location.pathname.startsWith('/malla') ? 'solid' : 'ghost'}
              bg={location.pathname.startsWith('/malla') ? 'whiteAlpha.300' : 'transparent'}
              color="white"
              borderRadius="lg"
              leftIcon={<FiGrid />}
              onClick={() => navigate('/malla')}
              _hover={{ bg: 'whiteAlpha.300', shadow: 'md' }}
            >
              Multimalla & Formulario
            </Button>
          </MotionBox>

          <MotionBox whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
            <Button
              size="sm"
              variant={location.pathname.startsWith('/historial') ? 'solid' : 'ghost'}
              bg={location.pathname.startsWith('/historial') ? 'whiteAlpha.300' : 'transparent'}
              color="white"
              borderRadius="lg"
              leftIcon={<FiCheckSquare />}
              onClick={() => navigate('/historial')}
              _hover={{ bg: 'whiteAlpha.300', shadow: 'md' }}
            >
              Cursos Aprobados
            </Button>
          </MotionBox>

          {userRole === 'admin' && (
            <MotionBox whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Button
                size="sm"
                variant={location.pathname.startsWith('/admin') ? 'solid' : 'ghost'}
                bg={location.pathname.startsWith('/admin') ? 'whiteAlpha.300' : 'transparent'}
                color="white"
                borderRadius="lg"
                leftIcon={<FiShield />}
                onClick={() => navigate('/admin/dashboard')}
                _hover={{ bg: 'whiteAlpha.300', shadow: 'md' }}
              >
                Panel Admin
              </Button>
            </MotionBox>
          )}

          {/* Menú de Usuario */}
          <Menu>
            <MenuButton
              as={Button}
              size="sm"
              variant="outline"
              borderColor="whiteAlpha.400"
              color="white"
              borderRadius="lg"
              rightIcon={<FiChevronDown />}
              _hover={{ bg: 'whiteAlpha.200' }}
              _active={{ bg: 'whiteAlpha.300' }}
              ml={2}
            >
              <HStack spacing={2}>
                <Icon as={FiUser} />
                <Text fontSize="xs" fontWeight="600" display={{ base: 'none', md: 'inline' }}>
                  {userEmail || 'Estudiante'}
                </Text>
                {userRole === 'admin' && (
                  <Badge colorScheme="purple" fontSize="0.6em" borderRadius="md">
                    ADMIN
                  </Badge>
                )}
              </HStack>
            </MenuButton>
            <MenuList color="gray.800" shadow="2xl" borderRadius="xl" p={2}>
              <Box px={3} py={2}>
                <Text fontWeight="bold" fontSize="xs" color="#002855">
                  Sesión Activa
                </Text>
                <Text fontSize="xs" color="gray.500" isTruncated maxW="200px">
                  {userEmail || 'pasmadm1@upao.edu.pe'}
                </Text>
              </Box>
              <MenuDivider />
              <MenuItem
                icon={<FiLogOut color="#e53e3e" />}
                color="red.600"
                fontWeight="600"
                fontSize="xs"
                borderRadius="md"
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
