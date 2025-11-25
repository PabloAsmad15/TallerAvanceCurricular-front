import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import SelectCourses from './pages/SelectCourses';
import SelectCoursesMultiMalla from './pages/SelectCoursesMultiMalla';
import Recommendations from './pages/Recommendations';
import CompareAlgorithms from './pages/CompareAlgorithms';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';

// Layout
import Layout from './components/layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="select-courses" element={<SelectCourses />} />
        <Route path="select-courses-multi" element={<SelectCoursesMultiMalla />} />
        <Route path="compare-algorithms" element={<CompareAlgorithms />} />
        <Route path="recommendations" element={<Recommendations />} />
        <Route path="history" element={<History />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
