import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recomendacionesAPI } from '../services/api';
import { 
  ChartBarIcon, 
  ClockIcon, 
  BookOpenIcon, 
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const CompareAlgorithms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparacion, setComparacion] = useState(null);
  
  const { mallaId, cursosAprobados } = location.state || {};

  useEffect(() => {
    if (!mallaId || !cursosAprobados) {
      navigate('/select-courses');
      return;
    }
    
    compararAlgoritmos();
  }, []);

  const compararAlgoritmos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await recomendacionesAPI.comparar({
        malla_id: mallaId,
        cursos_aprobados: cursosAprobados
      });
      
      setComparacion(response.data);
    } catch (err) {
      console.error('Error comparando algoritmos:', err);
      setError(err.response?.data?.detail || 'Error al comparar algoritmos');
    } finally {
      setLoading(false);
    }
  };

  const getAlgoritmoNombre = (key) => {
    const nombres = {
      'constraint_programming': 'Constraint Programming',
      'backtracking': 'Backtracking',
      'prolog': 'Prolog',
      'association_rules': 'Association Rules'
    };
    return nombres[key] || key;
  };

  const getAlgoritmoDescripcion = (key) => {
    const descripciones = {
      'constraint_programming': 'Optimización con restricciones - Google OR-Tools',
      'backtracking': 'Búsqueda exhaustiva con retroceso',
      'prolog': 'Motor de inferencia lógica',
      'association_rules': 'Aprendizaje automático de patrones'
    };
    return descripciones[key] || '';
  };

  const getAlgoritmoColor = (key, esSeleccionado) => {
    if (esSeleccionado) {
      return 'border-green-500 bg-green-50';
    }
    
    const colores = {
      'constraint_programming': 'border-blue-500 bg-blue-50',
      'backtracking': 'border-purple-500 bg-purple-50',
      'prolog': 'border-orange-500 bg-orange-50',
      'association_rules': 'border-pink-500 bg-pink-50'
    };
    return colores[key] || 'border-gray-300 bg-gray-50';
  };

  const getAlgoritmoIconColor = (key) => {
    const colores = {
      'constraint_programming': 'text-blue-600',
      'backtracking': 'text-purple-600',
      'prolog': 'text-orange-600',
      'association_rules': 'text-pink-600'
    };
    return colores[key] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Comparando 4 algoritmos...</p>
          <p className="text-gray-500 text-sm mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-xl font-semibold text-red-800">Error</h2>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/select-courses')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!comparacion) return null;

  const { resultados, algoritmo_seleccionado, razon_seleccion, metricas_comparacion } = comparacion;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/select-courses')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
          >
            ← Volver a selección de cursos
          </button>
          
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              <SparklesIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Comparación de Algoritmos</h1>
            </div>
            
            <p className="text-gray-600 mb-4">
              Hemos ejecutado los 4 algoritmos con tus datos. Aquí puedes ver cómo cada uno analizó tu caso.
            </p>
            
            {/* Algoritmo seleccionado por IA */}
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
              <div className="flex items-start">
                <TrophyIcon className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">
                    Algoritmo recomendado por IA: {getAlgoritmoNombre(algoritmo_seleccionado)}
                  </h3>
                  <p className="text-green-700 text-sm">{razon_seleccion}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Algoritmos exitosos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {metricas_comparacion.algoritmos_exitosos}/4
                  </p>
                </div>
                <CheckCircleIcon className="h-10 w-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Más rápido</p>
                  <p className="text-lg font-bold text-blue-600">
                    {getAlgoritmoNombre(metricas_comparacion.algoritmo_mas_rapido)}
                  </p>
                </div>
                <ClockIcon className="h-10 w-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Más cursos</p>
                  <p className="text-lg font-bold text-purple-600">
                    {getAlgoritmoNombre(metricas_comparacion.algoritmo_mas_cursos)}
                  </p>
                </div>
                <BookOpenIcon className="h-10 w-10 text-purple-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Más créditos</p>
                  <p className="text-lg font-bold text-orange-600">
                    {getAlgoritmoNombre(metricas_comparacion.algoritmo_mas_creditos)}
                  </p>
                </div>
                <ChartBarIcon className="h-10 w-10 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid de resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {resultados.map((resultado) => {
            const esSeleccionado = resultado.algoritmo === algoritmo_seleccionado;
            
            return (
              <div
                key={resultado.algoritmo}
                className={`bg-white rounded-xl shadow-lg border-2 ${getAlgoritmoColor(resultado.algoritmo, esSeleccionado)} p-6 relative overflow-hidden`}
              >
                {esSeleccionado && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg">
                    SELECCIONADO POR IA
                  </div>
                )}
                
                {/* Header del algoritmo */}
                <div className="mb-4">
                  <h3 className={`text-xl font-bold mb-1 ${getAlgoritmoIconColor(resultado.algoritmo)}`}>
                    {getAlgoritmoNombre(resultado.algoritmo)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getAlgoritmoDescripcion(resultado.algoritmo)}
                  </p>
                </div>

                {resultado.error ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center text-red-700">
                      <XCircleIcon className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Error: {resultado.error}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Métricas */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-2xl font-bold text-gray-800">{resultado.numero_cursos}</p>
                        <p className="text-xs text-gray-600">Cursos</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-2xl font-bold text-gray-800">{resultado.total_creditos}</p>
                        <p className="text-xs text-gray-600">Créditos</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-2xl font-bold text-gray-800">{resultado.tiempo_ejecucion}s</p>
                        <p className="text-xs text-gray-600">Tiempo</p>
                      </div>
                    </div>

                    {/* Estado de límite de créditos */}
                    <div className={`flex items-center justify-center p-2 rounded-lg mb-4 ${
                      resultado.cumple_limite_creditos 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {resultado.cumple_limite_creditos ? (
                        <>
                          <CheckCircleIcon className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium">Cumple límite de créditos</span>
                        </>
                      ) : (
                        <>
                          <XCircleIcon className="h-5 w-5 mr-2" />
                          <span className="text-sm font-medium">Excede límite de créditos</span>
                        </>
                      )}
                    </div>

                    {/* Lista de cursos recomendados */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm">
                        Cursos recomendados:
                      </h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {resultado.cursos_recomendados.map((curso, idx) => (
                          <div 
                            key={idx}
                            className="bg-white border border-gray-200 rounded-lg p-3 text-sm"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-gray-800">{curso.codigo}</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                {curso.creditos} créditos
                              </span>
                            </div>
                            <p className="text-gray-600 text-xs mb-1">{curso.nombre}</p>
                            <p className="text-gray-500 text-xs">Ciclo {curso.ciclo}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Consenso de cursos */}
        {metricas_comparacion.consenso_cursos?.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-indigo-600" />
              Cursos con Mayor Consenso
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              Estos cursos fueron recomendados por múltiples algoritmos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metricas_comparacion.consenso_cursos.slice(0, 6).map((curso, idx) => (
                <div 
                  key={idx}
                  className="border-2 border-indigo-200 bg-indigo-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold text-indigo-900">{curso.codigo}</span>
                      <p className="text-sm text-indigo-700">{curso.nombre}</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-indigo-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {curso.veces_recomendado}
                      </div>
                      <p className="text-xs text-indigo-600 mt-1">de 4</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(curso.veces_recomendado / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón para continuar */}
        <div className="text-center">
          <button
            onClick={() => {
              // Usar el algoritmo seleccionado para generar recomendación final
              navigate('/recommendations', {
                state: {
                  mallaId,
                  cursosAprobados,
                  algoritmoSugerido: algoritmo_seleccionado
                }
              });
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Continuar con Recomendación Final
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareAlgorithms;
