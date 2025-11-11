import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.endsWith('@upao.edu.pe')) {
      toast.error('El correo debe terminar en @upao.edu.pe');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authAPI.forgotPassword(email);
      setSent(true);
      
      // Si el backend devuelve un token (modo desarrollo), guardarlo
      if (response.data.token) {
        setResetUrl(response.data.reset_url);
        toast.success('Token generado (modo desarrollo)');
      } else {
        toast.success('Revisa tu correo para restablecer tu contraseña');
      }
    } catch (error) {
      toast.error('Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {resetUrl ? '¡Token Generado!' : '¡Correo Enviado!'}
          </h2>
          
          {resetUrl ? (
            <>
              <p className="text-gray-600 mb-4">
                El email no está configurado. Usa este enlace para restablecer tu contraseña:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6 break-all text-sm">
                <a 
                  href={resetUrl} 
                  className="text-primary-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resetUrl}
                </a>
              </div>
              <a 
                href={resetUrl} 
                className="btn btn-primary inline-block mb-3"
              >
                Ir a Restablecer Contraseña
              </a>
            </>
          ) : (
            <p className="text-gray-600 mb-6">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
              Por favor revisa tu bandeja de entrada y spam.
            </p>
          )}
          
          <Link to="/login" className="btn btn-secondary inline-block">
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
