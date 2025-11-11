import { useState, useEffect } from 'react';
import { Brain, TrendingUp, RefreshCw, Zap, Award, AlertCircle, CheckCircle, Info, BarChart3, Loader2 } from 'lucide-react';
import algorithmsAPI from '../services/algorithmsAPI';

const AdvancedRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [algorithm, setAlgorithm] = useState('prolog'); // 'prolog', 'association_rules', 'compare'
  const [resultado, setResultado] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);
  const [servicesStatus, setServicesStatus] = useState(null);

  // Cargar estado de servicios al montar
  useEffect(() => {
    loadServicesStatus();
  }, []);

  const loadServicesStatus = async () => {
    try {
      const status = await algorithmsAPI.getServicesStatus();
      setServicesStatus(status);
    } catch (err) {
      console.error('Error cargando estado:', err);
    }
  };

  const handleGenerateRecommendations = async () => {
    setLoading(true);
    setError(null);
    setResultado(null);
    setComparison(null);

    try {
      if (algorithm === 'prolog') {
        const data = await algorithmsAPI.getPrologRecommendations();
        setResultado(data);
      } else if (algorithm === 'association_rules') {
        const data = await algorithmsAPI.getAssociationRulesRecommendations(true);
        setResultado(data);
      } else if (algorithm === 'compare') {
        const data = await algorithmsAPI.compareAlgorithms(true);
        setComparison(data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al generar recomendaciones');
    } finally {
      setLoading(false);
    }
  };

  const renderDiagnostico = (diagnostico) => {
    if (!diagnostico) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Diagnóstico Académico
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-blue-600">Último Ciclo Completo</p>
            <p className="text-2xl font-bold text-blue-900">{diagnostico.ultimo_ciclo_completo}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Ciclo Matrícula</p>
            <p className="text-2xl font-bold text-blue-900">{diagnostico.ciclo_matricula}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600">Estado</p>
            <p className={`text-lg font-semibold ${diagnostico.estado === 'regular' ? 'text-green-600' : 'text-orange-600'}`}>
              {diagnostico.estado === 'regular' ? '✓ Regular' : '⚠ Irregular'}
            </p>
          </div>
          {diagnostico.porcentaje_avance !== undefined && (
            <div>
              <p className="text-sm text-blue-600">Avance</p>
              <p className="text-2xl font-bold text-blue-900">{diagnostico.porcentaje_avance}%</p>
            </div>
          )}
        </div>
        {diagnostico.cursos_pendientes && diagnostico.cursos_pendientes.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-orange-700 mb-1">Cursos Pendientes:</p>
            <div className="flex flex-wrap gap-2">
              {diagnostico.cursos_pendientes.map((curso, idx) => (
                <span key={idx} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                  {curso}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCursos = (cursos, titulo) => {
    if (!cursos || cursos.length === 0) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{titulo}</h3>
        <div className="space-y-2">
          {cursos.map((curso, idx) => (
            <div key={idx} className="border border-gray-200 rounded p-3 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">[{curso.codigo}]</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      curso.tipo === 'Obligatorio' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {curso.tipo}
                    </span>
                  </div>
                  <p className="text-gray-700">{curso.nombre}</p>
                  {curso.prerrequisitos && curso.prerrequisitos.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Prereq: {curso.prerrequisitos.join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-600">Ciclo {curso.ciclo}</p>
                  <p className="text-lg font-bold text-blue-600">{curso.creditos} cr</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderRecomendacion = (recomendacion) => {
    if (!recomendacion) return null;

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Recomendación de Matrícula</h3>
              <p className="text-blue-100">Total: {recomendacion.total_cursos} cursos</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{recomendacion.creditos_totales}</p>
              <p className="text-sm text-blue-100">de {recomendacion.creditos_maximos} créditos</p>
            </div>
          </div>
        </div>
        {renderCursos(recomendacion.cursos, 'Cursos Recomendados')}
      </div>
    );
  };

  const renderComparison = () => {
    if (!comparison) return null;

    const { prolog, association_rules, comparacion } = comparison;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-2">Comparación de Algoritmos</h3>
          <p className="text-purple-100">Análisis lado a lado de ambas estrategias</p>
        </div>

        {/* Estadísticas de comparación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Prolog</h4>
            </div>
            <p className="text-3xl font-bold text-blue-600">{comparacion.total_cursos_prolog}</p>
            <p className="text-sm text-gray-600">{comparacion.creditos_prolog} créditos</p>
          </div>

          <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Reglas de Asociación</h4>
            </div>
            <p className="text-3xl font-bold text-purple-600">{comparacion.total_cursos_association}</p>
            <p className="text-sm text-gray-600">{comparacion.creditos_association} créditos</p>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-green-600" />
              <h4 className="font-semibold text-gray-900">Similitud</h4>
            </div>
            <p className="text-3xl font-bold text-green-600">{comparacion.similitud.toFixed(0)}%</p>
            <p className="text-sm text-gray-600">{comparacion.total_comunes} cursos comunes</p>
          </div>
        </div>

        {/* Cursos comunes */}
        {comparacion.cursos_comunes.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Cursos Recomendados por Ambos Algoritmos
            </h4>
            <div className="flex flex-wrap gap-2">
              {comparacion.cursos_comunes.map((curso, idx) => (
                <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {curso}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resultados individuales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Prolog */}
          <div className="border-2 border-blue-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Recomendación Prolog
            </h4>
            {prolog.diagnostico && renderDiagnostico(prolog.diagnostico)}
            {prolog.recomendacion && renderCursos(prolog.recomendacion.cursos, 'Cursos')}
          </div>

          {/* Association Rules */}
          <div className="border-2 border-purple-200 rounded-lg p-4">
            <h4 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recomendación Reglas de Asociación
            </h4>
            {association_rules.diagnostico && renderDiagnostico(association_rules.diagnostico)}
            {association_rules.recomendacion && renderCursos(association_rules.recomendacion.cursos, 'Cursos')}
            {association_rules.reglas_asociacion && (
              <div className="mt-3 bg-purple-50 border border-purple-200 rounded p-3">
                <p className="text-sm font-medium text-purple-900 mb-1">Estadísticas del Modelo:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-purple-600">Reglas aprendidas:</span>
                    <span className="ml-1 font-semibold">{association_rules.reglas_asociacion.total_reglas}</span>
                  </div>
                  <div>
                    <span className="text-purple-600">Confianza promedio:</span>
                    <span className="ml-1 font-semibold">{(association_rules.reglas_asociacion.confianza_promedio * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Algoritmos Avanzados de Recomendación</h1>
        <p className="text-blue-100">Usa inteligencia artificial y lógica declarativa para optimizar tu matrícula</p>
      </div>

      {/* Estado de servicios */}
      {servicesStatus && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Estado de Servicios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 ${servicesStatus.prolog.disponible ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium text-gray-900">Prolog</p>
                <p className="text-sm text-gray-600">{servicesStatus.prolog.descripcion}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 ${servicesStatus.association_rules.disponible ? 'bg-green-500' : 'bg-red-500'}`} />
              <div>
                <p className="font-medium text-gray-900">
                  Reglas de Asociación 
                  {servicesStatus.association_rules.entrenado && <span className="ml-2 text-xs text-green-600">(Entrenado)</span>}
                </p>
                <p className="text-sm text-gray-600">{servicesStatus.association_rules.descripcion}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selector de algoritmo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-900 mb-4">Selecciona un Algoritmo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setAlgorithm('prolog')}
            className={`p-4 rounded-lg border-2 transition-all ${
              algorithm === 'prolog'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <Brain className={`w-8 h-8 mb-2 ${algorithm === 'prolog' ? 'text-blue-600' : 'text-gray-400'}`} />
            <h4 className="font-semibold text-gray-900">Prolog</h4>
            <p className="text-sm text-gray-600 mt-1">Lógica declarativa y reglas académicas</p>
          </button>

          <button
            onClick={() => setAlgorithm('association_rules')}
            className={`p-4 rounded-lg border-2 transition-all ${
              algorithm === 'association_rules'
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <TrendingUp className={`w-8 h-8 mb-2 ${algorithm === 'association_rules' ? 'text-purple-600' : 'text-gray-400'}`} />
            <h4 className="font-semibold text-gray-900">Reglas de Asociación</h4>
            <p className="text-sm text-gray-600 mt-1">Aprendizaje de patrones históricos</p>
          </button>

          <button
            onClick={() => setAlgorithm('compare')}
            className={`p-4 rounded-lg border-2 transition-all ${
              algorithm === 'compare'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <BarChart3 className={`w-8 h-8 mb-2 ${algorithm === 'compare' ? 'text-green-600' : 'text-gray-400'}`} />
            <h4 className="font-semibold text-gray-900">Comparar</h4>
            <p className="text-sm text-gray-600 mt-1">Analiza ambos algoritmos</p>
          </button>
        </div>

        <button
          onClick={handleGenerateRecommendations}
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generando Recomendaciones...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Generar Recomendaciones
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      {algorithm !== 'compare' && resultado && (
        <div className="space-y-6">
          {resultado.completado ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-green-900">{resultado.mensaje}</h3>
                </div>
              </div>
            </div>
          ) : (
            <>
              {resultado.diagnostico && renderDiagnostico(resultado.diagnostico)}
              {resultado.recomendacion && renderRecomendacion(resultado.recomendacion)}
            </>
          )}
        </div>
      )}

      {algorithm === 'compare' && renderComparison()}
    </div>
  );
};

export default AdvancedRecommendations;
