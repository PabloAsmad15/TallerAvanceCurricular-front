import { useNavigate } from 'react-router-dom';
import { useRecommendationStore } from '../store/recommendationStore';
import { Sparkles, Clock, TrendingUp, BookOpen, ArrowLeft, Brain, Zap } from 'lucide-react';

export default function Recommendations() {
  const navigate = useNavigate();
  const currentRecommendation = useRecommendationStore(state => state.currentRecommendation);

  if (!currentRecommendation) {
    return (
      <div className="max-w-4xl">
        <div className="card text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No hay recomendación disponible
          </h2>
          <p className="text-gray-600 mb-6">
            Selecciona tus cursos aprobados para obtener una recomendación personalizada
          </p>
          <button
            onClick={() => navigate('/select-courses')}
            className="btn btn-primary"
          >
            Ir a Selección de Cursos
          </button>
        </div>
      </div>
    );
  }

  const { algoritmo_usado, razon_algoritmo, cursos_recomendados, tiempo_ejecucion } = currentRecommendation;
  
  const algorithmInfo = {
    constraint_programming: {
      name: 'Constraint Programming',
      icon: Brain,
      color: 'blue',
      description: 'Optimización con OR-Tools'
    },
    backtracking: {
      name: 'Backtracking',
      icon: Zap,
      color: 'purple',
      description: 'Búsqueda exhaustiva eficiente'
    }
  };

  const info = algorithmInfo[algoritmo_usado] || algorithmInfo.backtracking;
  const Icon = info.icon;

  const getPriorityBadge = (prioridad) => {
    const badges = {
      1: { text: 'Alta Prioridad', class: 'badge bg-red-100 text-red-800' },
      2: { text: 'Prioridad Media', class: 'badge bg-yellow-100 text-yellow-800' },
      3: { text: 'Prioridad Baja', class: 'badge bg-green-100 text-green-800' },
    };
    return badges[prioridad] || badges[2];
  };

  return (
    <div className="max-w-5xl">
      {/* Back Button */}
      <button
        onClick={() => navigate('/select-courses')}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a selección
      </button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Sparkles className="w-8 h-8 mr-3 text-yellow-500" />
          Tu Recomendación Personalizada
        </h1>
        <p className="text-gray-600">
          Basada en tu avance académico y generada con inteligencia artificial
        </p>
      </div>

      {/* Algorithm Info Card */}
      <div className={`card mb-6 border-2 border-${info.color}-200 bg-${info.color}-50`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 bg-${info.color}-500 rounded-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">
                🤖 Algoritmo Utilizado: {info.name}
              </h3>
              <span className="badge badge-info">
                {info.description}
              </span>
            </div>
            <p className="text-gray-700 mb-3">
              <strong>Decisión del Agente IA:</strong> {razon_algoritmo}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  Tiempo de ejecución: <strong>{tiempo_ejecucion.toFixed(3)}s</strong>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {cursos_recomendados.length} cursos recomendados
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-primary-500" />
          Cursos Recomendados
        </h2>
        
        <div className="space-y-4">
          {cursos_recomendados.map((curso, index) => {
            const badge = getPriorityBadge(curso.prioridad);
            
            return (
              <div key={curso.curso_id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  
                  {/* Course Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-bold text-gray-900">
                            {curso.codigo}
                          </h3>
                          <span className={badge.class}>
                            {badge.text}
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium">
                          {curso.nombre}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Ciclo {curso.ciclo}</div>
                        <div className="text-sm font-semibold text-primary-600">
                          {curso.creditos} créditos
                        </div>
                      </div>
                    </div>
                    
                    {/* Reason */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong className="text-gray-900">Razón:</strong> {curso.razon}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Card */}
      <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
        <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Resumen</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-600">Total Cursos</div>
            <div className="text-2xl font-bold text-gray-900">{cursos_recomendados.length}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Total Créditos</div>
            <div className="text-2xl font-bold text-gray-900">
              {cursos_recomendados.reduce((sum, c) => sum + c.creditos, 0)}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Alta Prioridad</div>
            <div className="text-2xl font-bold text-red-600">
              {cursos_recomendados.filter(c => c.prioridad === 1).length}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Algoritmo</div>
            <div className="text-sm font-bold text-gray-900">{info.name}</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => navigate('/select-courses')}
          className="btn btn-outline flex-1"
        >
          Generar Nueva Recomendación
        </button>
        <button
          onClick={() => navigate('/history')}
          className="btn btn-secondary flex-1"
        >
          Ver Historial
        </button>
      </div>
    </div>
  );
}
