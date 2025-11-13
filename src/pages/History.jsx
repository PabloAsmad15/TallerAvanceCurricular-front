import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Calendar, Clock, Brain, Zap, Sparkles, BookOpen, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { recomendacionesAPI } from '../services/api';
import { useRecommendationStore } from '../store/recommendationStore';

export default function History() {
  const navigate = useNavigate();
  const setCurrentRecommendation = useRecommendationStore(state => state.setCurrentRecommendation);
  
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
    loadStats();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await recomendacionesAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      
      // Solo mostrar error si no es 401 (porque eso redirige automáticamente)
      if (error.response?.status !== 401) {
        toast.error('Error al cargar el historial. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await recomendacionesAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error al cargar estadísticas');
    }
  };

  const handleViewRecommendation = (recommendation) => {
    setCurrentRecommendation(recommendation);
    navigate('/recommendations');
  };

  const getAlgorithmInfo = (algoritmo) => {
    const info = {
      constraint_programming: {
        name: 'Constraint Programming',
        icon: Brain,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      backtracking: {
        name: 'Backtracking',
        icon: Zap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      prolog: {
        name: 'Prolog',
        icon: BookOpen,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      association_rules: {
        name: 'Association Rules',
        icon: TrendingUp,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100'
      }
    };
    return info[algoritmo] || info.constraint_programming;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="card text-center py-12">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <HistoryIcon className="w-8 h-8 mr-3 text-primary-500" />
          Historial de Recomendaciones
        </h1>
        <p className="text-gray-600">
          Revisa todas tus recomendaciones anteriores y las decisiones del agente IA
        </p>
      </div>

      {/* Stats Cards */}
      {stats.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {stats.map((stat) => {
            const info = getAlgorithmInfo(stat.algoritmo);
            const Icon = info.icon;
            
            return (
              <div key={stat.algoritmo} className={`card ${info.bgColor}`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 ${info.color} bg-white rounded-lg`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{info.name}</h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold">{stat.total_usos}</span> veces usado
                      </div>
                      <div>
                        <span className="font-semibold">{stat.tiempo_promedio}s</span> promedio
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="card text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay recomendaciones todavía
          </h3>
          <p className="text-gray-600 mb-6">
            Genera tu primera recomendación personalizada
          </p>
          <button
            onClick={() => navigate('/select-courses')}
            className="btn btn-primary"
          >
            Crear Recomendación
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((recomendacion) => {
            const info = getAlgorithmInfo(recomendacion.algoritmo_usado);
            const Icon = info.icon;
            
            return (
              <div key={recomendacion.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Algorithm Icon */}
                    <div className={`p-3 ${info.bgColor} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">
                          {info.name}
                        </h3>
                        <span className="badge badge-info">
                          {recomendacion.cursos_recomendados.length} cursos
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {recomendacion.razon_algoritmo}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(recomendacion.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{recomendacion.tiempo_ejecucion.toFixed(3)}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button
                    onClick={() => handleViewRecommendation(recomendacion)}
                    className="btn btn-outline ml-4"
                  >
                    Ver Detalles
                  </button>
                </div>
                
                {/* Preview of courses */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {recomendacion.cursos_recomendados.slice(0, 5).map((curso) => (
                      <span
                        key={curso.curso_id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {curso.codigo}
                      </span>
                    ))}
                    {recomendacion.cursos_recomendados.length > 5 && (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-full text-sm font-medium">
                        +{recomendacion.cursos_recomendados.length - 5} más
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
