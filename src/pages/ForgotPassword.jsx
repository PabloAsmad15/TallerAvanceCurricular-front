import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import authService from '../services/authService';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.endsWith('@upao.edu.pe')) {
      toast.error('El correo debe terminar en @upao.edu.pe');
      return;
    }
    
    setLoading(true);
    
    try {
      await authService.resetPassword(email);
      setEmailSent(true);
      toast.success('Correo de recuperación enviado');
    } catch (error) {
      const message = error.message || 'Error al enviar correo de recuperación';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Correo Enviado!
          </h2>
          <p className="text-gray-600 mb-6">
            Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
            Por favor revisa tu bandeja de entrada y spam.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Si no recibes el correo en los próximos minutos, 
              revisa tu carpeta de spam o correo no deseado.
            </p>
          </div>
          <button
            onClick={() => setEmailSent(false)}
            className="btn btn-secondary mb-3"
          >
            Enviar nuevamente
          </button>
          <Link to="/login" className="block text-primary-600 hover:text-primary-700">
            Volver al Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Link to="/login" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Link>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Olvidaste tu contraseña?</h2>
          <p className="text-gray-600 mb-6">
            Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? 'Enviando...' : 'Enviar Enlace'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
