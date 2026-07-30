import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import PasswordRecoveryPage from './pages/auth/PasswordRecoveryPage';
import ChatPage from './pages/chat/ChatPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import useAuthStore from './store/authStore';

// Componente protegido con Navbar integrado
const ProtectedLayout = ({ children, allowedRole }) => {
  const token = useAuthStore((state) => state.token);
  const userRole = useAuthStore((state) => state.userRole);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/app" replace />;
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box p={{ base: 2, md: 4 }}>
        {children}
      </Box>
    </Box>
  );
};

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
          <Route
            path="/app/*"
            element={
              <ProtectedLayout>
                <ChatPage />
              </ProtectedLayout>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedLayout allowedRole="admin">
                <AdminDashboard />
              </ProtectedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App;
