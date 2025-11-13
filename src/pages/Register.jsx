import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellido: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    // Validar nombre
    if (formData.nombre.trim().length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres');
      return;
    }
    
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(formData.nombre)) {
      toast.error('El nombre debe contener al menos una letra');
      return;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.]+$/.test(formData.nombre)) {
      toast.error('El nombre solo puede contener letras, espacios y puntos');
      return;
    }
    
    // Validar apellido
    if (formData.apellido.trim().length < 2) {
      toast.error('El apellido debe tener al menos 2 caracteres');
      return;
    }
    
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(formData.apellido)) {
      toast.error('El apellido debe contener al menos una letra');
      return;
    }
    
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s\.]+$/.test(formData.apellido)) {
      toast.error('El apellido solo puede contener letras, espacios y puntos');
      return;
    }
    
    // Validar email
    if (!formData.email.endsWith('@upao.edu.pe')) {
      toast.error('El correo debe terminar en @upao.edu.pe');
      return;
    }
    
    // Validar longitud mínima de contraseña
    if (formData.password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    // Validar que contenga letras
    if (!/[a-zA-Z]/.test(formData.password)) {
      toast.error('La contraseña debe contener al menos una letra');
      return;
    }
    
    // Validar que contenga números
    if (!/\d/.test(formData.password)) {
      toast.error('La contraseña debe contener al menos un número');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    setLoading(true);
    
    try {
      // Registrar con Firebase y sincronizar con backend
      const userData = await authService.register(
        formData.email,
        formData.password,
        formData.nombre,
        formData.apellido
      );
      
      // Obtener token de Firebase
      const token = localStorage.getItem('token');
      
      // Guardar autenticación
      setAuth(userData, token);
      
      toast.success(`¡Bienvenido ${userData.nombre}!`);
      
      // Redirigir según el tipo de usuario
      if (userData.is_admin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error en registro:', error); // Solo para debugging en consola
      
      // Mensaje genérico y seguro para el usuario
      let userMessage = 'Ocurrió un error al crear tu cuenta. Por favor, intenta nuevamente.';
      
      // Solo mostrar mensajes amigables específicos (no técnicos)
      if (error.message && !error.message.includes('fetch') && !error.message.includes('network') && !error.message.includes('404')) {
        userMessage = error.message;
      } else if (error.message && error.message.includes('network')) {
        userMessage = 'Error de conexión. Verifica tu internet e intenta nuevamente.';
      } else if (error.message && error.message.includes('404')) {
        userMessage = 'Servicio no disponible temporalmente. Intenta más tarde.';
      }
      
      toast.error(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white rounded-full mb-4">
            <UserPlus className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-primary-100">Universidad Privada Antenor Orrego</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Tu nombre (ej: Juan)"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Solo letras, espacios y puntos
              </p>
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Tu apellido (ej: Pérez)"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Solo letras, espacios y puntos
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="tu.correo@upao.edu.pe"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                💡 Debe contener al menos una letra y un número (ej: MiClave123)
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  className="input pl-10"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
