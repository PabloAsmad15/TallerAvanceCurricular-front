import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Sparkles, TrendingUp, Brain } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-6xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido, {user?.nombre}!
        </h1>
        <p className="text-gray-600">
          Sistema de Recomendación Curricular con Inteligencia Artificial
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/select-courses')}>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-primary-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Seleccionar Cursos
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Selecciona tu malla curricular y marca los cursos que ya aprobaste
              </p>
              <button className="btn btn-primary">
                Comenzar
              </button>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/recommendations')}>
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ver Recomendaciones
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Obtén recomendaciones personalizadas con IA
              </p>
              <button className="btn btn-outline">
                Ver
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="card bg-gradient-to-br from-primary-50 to-blue-50 border-2 border-primary-200">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-white rounded-lg">
            <Brain className="w-8 h-8 text-primary-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              🤖 Agente de IA Inteligente
            </h3>
            <p className="text-gray-700 mb-4">
              Nuestro sistema utiliza un <strong>agente de inteligencia artificial</strong> 
              que analiza tu situación académica y decide automáticamente el mejor algoritmo 
              de recomendación para ti entre <strong>4 algoritmos especializados</strong>:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-primary-700 mb-2">
                  📊 Constraint Programming
                </h4>
                <p className="text-sm text-gray-600">
                  Usa OR-Tools para problemas complejos con muchas restricciones 
                  y prerequisitos interdependientes
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-purple-700 mb-2">
                  🔍 Backtracking
                </h4>
                <p className="text-sm text-gray-600">
                  Algoritmo eficiente para búsquedas directas cuando estás 
                  cerca de graduarte
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-green-700 mb-2">
                  📚 Prolog
                </h4>
                <p className="text-sm text-gray-600">
                  Lógica declarativa que garantiza el cumplimiento de todas 
                  las reglas académicas
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h4 className="font-semibold text-orange-700 mb-2">
                  🎯 Association Rules
                </h4>
                <p className="text-sm text-gray-600">
                  Aprende de patrones históricos para recomendar combinaciones 
                  exitosas de cursos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <p>
                El agente considera: tu avance, prerequisitos, complejidad y más 
                para elegir la mejor estrategia
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-8 card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Selecciona tu malla</h4>
              <p className="text-sm text-gray-600">
                Elige entre las mallas 2015, 2019, 2022 o 2025
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Marca tus cursos aprobados</h4>
              <p className="text-sm text-gray-600">
                Por cada ciclo, selecciona los cursos que ya aprobaste
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Obtén recomendaciones</h4>
              <p className="text-sm text-gray-600">
                El agente IA analizará tu situación y te recomendará los mejores cursos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
