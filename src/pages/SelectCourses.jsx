import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Sparkles, Loader, BookOpen, ChartBarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { mallasAPI, cursosAPI, recomendacionesAPI } from '../services/api';
import { useRecommendationStore } from '../store/recommendationStore';
import { cursosPorMalla } from '../data/cursosPorMalla';

export default function SelectCourses() {
  const navigate = useNavigate();
  const {
    selectedMalla,
    selectedCourses,
    setSelectedMalla,
    toggleCourse,
    setSelectedCourses,
    setCurrentRecommendation,
  } = useRecommendationStore();

  const mallas = [
    { id: 1, nombre: "Malla Curricular", anio: 2015 },
    { id: 2, nombre: "Malla Curricular", anio: 2019 },
    { id: 3, nombre: "Malla Curricular", anio: 2022 },
    { id: 4, nombre: "Malla Curricular", anio: 2025 }
  ];

  const [cursosPorCiclo, setCursosPorCiclo] = useState([]);
  const [generatingRecommendation, setGeneratingRecommendation] = useState(false);
  const [expandedCiclos, setExpandedCiclos] = useState([1, 2, 3]);
  const [prerequisitosMap, setPrerequisitosMap] = useState({});
  const [convalidacionesMap, setConvalidacionesMap] = useState({});

  // Cargar cursos y prerequisitos cuando cambia la malla
  useEffect(() => {
    if (selectedMalla) {
      loadCursos();
      loadPrerequisitos();
    }
  }, [selectedMalla]);

  const loadPrerequisitos = async () => {
    if (!selectedMalla) return;
    
    try {
      // Intentar cargar desde caché primero (performance)
      const cacheKey = `prerequisitos_malla_${selectedMalla.id}`;
      const cached = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      
      // Usar caché si tiene menos de 1 hora
      if (cached && cacheTime && (Date.now() - parseInt(cacheTime)) < 3600000) {
        const cachedData = JSON.parse(cached);
        setPrerequisitosMap(cachedData.prerequisitos);
        setConvalidacionesMap(cachedData.convalidaciones);
        console.log('✅ Prerequisitos cargados desde caché');
        return;
      }
      
      // Cargar prerequisitos REALES desde el backend
      const response = await cursosAPI.getPrerequisitos(selectedMalla.id);
      
      if (response.data) {
        // Crear mapa de prerequisitos: curso -> [prerequisitos]
        const prerequisitosMap = {};
        response.data.prerequisitos.forEach(prereq => {
          if (!prerequisitosMap[prereq.curso_codigo]) {
            prerequisitosMap[prereq.curso_codigo] = [];
          }
          prerequisitosMap[prereq.curso_codigo].push(prereq.prerequisito_codigo);
        });
        
        // Crear mapa de convalidaciones: curso -> [cursos_equivalentes]
        const convalidacionesMap = {};
        response.data.convalidaciones.forEach(conv => {
          // Bidireccional: ambos cursos se convalidan entre sí
          if (!convalidacionesMap[conv.curso_destino_codigo]) {
            convalidacionesMap[conv.curso_destino_codigo] = [];
          }
          convalidacionesMap[conv.curso_destino_codigo].push(conv.curso_origen_codigo);
          
          if (!convalidacionesMap[conv.curso_origen_codigo]) {
            convalidacionesMap[conv.curso_origen_codigo] = [];
          }
          convalidacionesMap[conv.curso_origen_codigo].push(conv.curso_destino_codigo);
        });
        
        setPrerequisitosMap(prerequisitosMap);
        setConvalidacionesMap(convalidacionesMap);
        
        // Guardar en caché para futuras cargas
        localStorage.setItem(cacheKey, JSON.stringify({
          prerequisitos: prerequisitosMap,
          convalidaciones: convalidacionesMap
        }));
        localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        
        console.log(`✅ Prerequisitos cargados: ${Object.keys(prerequisitosMap).length} cursos`);
        console.log(`✅ Convalidaciones: ${response.data.convalidaciones.length} relaciones`);
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar prerequisitos, validación será en backend:', error);
      // Si falla, usar validación solo en backend (silencioso)
      setPrerequisitosMap({});
      setConvalidacionesMap({});
      // Backend validará - no hay problema
    }
  };

  const loadCursos = () => {
    const cursosData = cursosPorMalla[selectedMalla.anio.toString()];
    if (cursosData) {
      // Convertir el objeto a array de ciclos
      const ciclosArray = Object.entries(cursosData).map(([ciclo, cursos]) => ({
        ciclo: parseInt(ciclo),
        cursos: cursos.map((curso, index) => ({
          id: curso.codigo, // Usar el código como ID para que se envíe correctamente al backend
          codigo: curso.codigo,
          nombre: curso.nombre,
          creditos: 4, // Valor por defecto, ajusta si tienes esta info
          ciclo: parseInt(ciclo)
        }))
      }));
      setCursosPorCiclo(ciclosArray);
    } else {
      setCursosPorCiclo([]);
      toast.error('No hay cursos disponibles para esta malla');
    }
  };

  const handleMallaChange = (e) => {
    const mallaAnio = parseInt(e.target.value);
    const malla = mallas.find(m => m.anio === mallaAnio);
    setSelectedMalla(malla);
    setCursosPorCiclo([]);
  };

  const toggleCiclo = (ciclo) => {
    setExpandedCiclos(prev =>
      prev.includes(ciclo)
        ? prev.filter(c => c !== ciclo)
        : [...prev, ciclo]
    );
  };

  // Función para validar prerequisitos de un curso
  const validarPrerequisitos = (cursoId) => {
    const prerequisitos = prerequisitosMap[cursoId] || [];
    if (prerequisitos.length === 0) return { valido: true, faltantes: [] };
    
    const prerequisitosFaltantes = [];
    
    for (const prereqCodigo of prerequisitos) {
      // Verificar si el prerequisito está aprobado directamente
      let prereqCumplido = selectedCourses.includes(prereqCodigo);
      
      // Si no está aprobado, verificar convalidaciones
      if (!prereqCumplido) {
        const convalidados = convalidacionesMap[prereqCodigo] || [];
        prereqCumplido = convalidados.some(convCodigo => 
          selectedCourses.includes(convCodigo)
        );
      }
      
      if (!prereqCumplido) {
        prerequisitosFaltantes.push(prereqCodigo);
      }
    }
    
    return {
      valido: prerequisitosFaltantes.length === 0,
      faltantes: prerequisitosFaltantes
    };
  };

  // Función para manejar la selección/deselección de cursos
  const handleToggleCourse = (cursoId) => {
    const isCurrentlySelected = selectedCourses.includes(cursoId);
    
    if (isCurrentlySelected) {
      // Deseleccionar el curso
      toggleCourse(cursoId);
    } else {
      // Validar prerequisitos con convalidaciones
      const validacion = validarPrerequisitos(cursoId);
      
      if (!validacion.valido && validacion.faltantes.length > 0) {
        // Advertencia suave con sugerencia
        toast(
          `💡 Sugerencia: Considera marcar primero ${validacion.faltantes.join(', ')}`,
          { 
            duration: 4000, 
            icon: '💡',
            style: {
              background: '#FEF3C7',
              color: '#92400E',
              border: '1px solid #FCD34D'
            }
          }
        );
      }
      
      // SIEMPRE MARCA - libertad del usuario, backend valida
      toggleCourse(cursoId);
    }
  };

  const toggleAllCursosInCiclo = (ciclo) => {
    const cursosDelCiclo = cursosPorCiclo.find(c => c.ciclo === ciclo);
    if (!cursosDelCiclo) return;

    const cursoIdsDelCiclo = cursosDelCiclo.cursos.map(c => c.id);
    const todosSeleccionados = cursoIdsDelCiclo.every(id => selectedCourses.includes(id));

    if (todosSeleccionados) {
      // Deseleccionar todos los cursos de este ciclo
      const newSelected = selectedCourses.filter(id => !cursoIdsDelCiclo.includes(id));
      setSelectedCourses(newSelected);
    } else {
      // Seleccionar todos los cursos de este ciclo (sin validar prerequisitos)
      const newSelected = [...new Set([...selectedCourses, ...cursoIdsDelCiclo])];
      setSelectedCourses(newSelected);
      toast.success(`✓ Ciclo ${ciclo} marcado completamente`, { duration: 2000 });
    }
  };

  const handleGenerateRecommendation = async () => {
    if (!selectedMalla) {
      toast.error('Selecciona una malla primero');
      return;
    }

    if (selectedCourses.length === 0) {
      toast.error('Selecciona al menos un curso aprobado');
      return;
    }

    setGeneratingRecommendation(true);
    
    try {
      const response = await recomendacionesAPI.create({
        malla_id: selectedMalla.id,
        cursos_aprobados: selectedCourses,
      });
      
      setCurrentRecommendation(response.data);
      toast.success('¡Recomendación generada exitosamente!');
      navigate('/recommendations');
    } catch (error) {
      console.error('Error al generar recomendación:', error);
      
      // Mostrar errores de validación de prerequisitos
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        
        // Si es un objeto con errores de prerequisitos
        if (detail.errores && Array.isArray(detail.errores)) {
          // Mostrar cada error en un toast separado
          toast.error(detail.mensaje || 'Error de validación', { duration: 6000 });
          detail.errores.forEach((err, index) => {
            setTimeout(() => {
              toast.error(err, { duration: 8000 });
            }, (index + 1) * 300); // Escalonar los mensajes
          });
        }
        // Si es un array de errores directamente
        else if (Array.isArray(detail)) {
          detail.forEach((err, index) => {
            setTimeout(() => {
              toast.error(err, { duration: 6000 });
            }, index * 300);
          });
        }
        // Si es un string
        else if (typeof detail === 'string') {
          toast.error(detail, { duration: 5000 });
        }
        else {
          toast.error('Error al validar los cursos seleccionados', { duration: 5000 });
        }
      } else {
        toast.error('Error al conectar con el servidor', { duration: 5000 });
      }
    } finally {
      setGeneratingRecommendation(false);
    }
  };

  const getProgressPercentage = () => {
    if (cursosPorCiclo.length === 0) return 0;
    const totalCursos = cursosPorCiclo.reduce((sum, ciclo) => sum + ciclo.cursos.length, 0);
    return Math.round((selectedCourses.length / totalCursos) * 100);
  };

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Seleccionar Cursos Aprobados
        </h1>
        <p className="text-gray-600">
          Marca los cursos que ya aprobaste para obtener una recomendación personalizada
        </p>
      </div>

      {/* Malla Selector */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecciona tu Malla Curricular
        </label>
        <select
          value={selectedMalla?.anio || ''}
          onChange={handleMallaChange}
          className="input"
        >
          <option value="">-- Selecciona una malla --</option>
          {mallas.map(malla => (
            <option key={malla.id} value={malla.anio}>
              {malla.nombre} {malla.anio}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar */}
      {selectedMalla && cursosPorCiclo.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso: {selectedCourses.length} cursos seleccionados
            </span>
            <span className="text-sm font-bold text-primary-500">
              {getProgressPercentage()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}

      {/* Cursos por Ciclo */}
      {cursosPorCiclo.length > 0 && (
        <div className="space-y-4 mb-6">
          {cursosPorCiclo.map(({ ciclo, cursos }) => {
            const isExpanded = expandedCiclos.includes(ciclo);
            const cursosAprobadosEnCiclo = cursos.filter(c => selectedCourses.includes(c.id)).length;
            const todosSeleccionados = cursos.every(c => selectedCourses.includes(c.id));
            const algunoSeleccionado = cursos.some(c => selectedCourses.includes(c.id));
            
            return (
              <div key={ciclo} className="card">
                {/* Ciclo Header */}
                <div className="flex items-center p-4">
                  {/* Checkbox para seleccionar/deseleccionar todo el ciclo */}
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAllCursosInCiclo(ciclo);
                    }}
                    className="flex items-center justify-center w-6 h-6 mr-3 cursor-pointer"
                  >
                    {todosSeleccionados ? (
                      <CheckCircle className="w-6 h-6 text-primary-500" />
                    ) : algunoSeleccionado ? (
                      <div className="w-6 h-6 rounded-full border-2 border-primary-500 bg-primary-100 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-primary-500" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  {/* Resto del header clickeable para expandir/colapsar */}
                  <button
                    onClick={() => toggleCiclo(ciclo)}
                    className="flex-1 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                        {ciclo}
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">
                          Ciclo {ciclo}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {cursosAprobadosEnCiclo} de {cursos.length} cursos seleccionados
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Cursos List */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {cursos.map(curso => {
                      const isSelected = selectedCourses.includes(curso.id);
                      
                      return (
                        <button
                          key={curso.id}
                          onClick={() => handleToggleCourse(curso.id)}
                          className={`w-full flex items-start space-x-3 p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {isSelected ? (
                            <CheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 text-left">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-gray-900">
                                {curso.codigo}
                              </div>
                              {/* Indicador visual de prerequisitos */}
                              {!isSelected && prerequisitosMap[curso.id]?.length > 0 && (() => {
                                const validacion = validarPrerequisitos(curso.id);
                                if (!validacion.valido) {
                                  return (
                                    <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                                      ⚠️ {validacion.faltantes.length} prereq
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                            <div className="text-sm text-gray-600">
                              {curso.nombre}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {curso.creditos} créditos
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action Button */}
      {cursosPorCiclo.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">¿Listo para la recomendación?</h3>
              <p className="text-sm text-primary-100">
                Has seleccionado {selectedCourses.length} cursos aprobados
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/compare-algorithms', {
                  state: {
                    mallaId: selectedMalla.id,
                    cursosAprobados: selectedCourses
                  }
                })}
                disabled={selectedCourses.length === 0}
                className="btn bg-white/90 text-primary-600 hover:bg-white flex items-center space-x-2 px-6 py-3"
              >
                <ChartBarIcon className="w-5 h-5" />
                <span>Comparar Algoritmos</span>
              </button>
              <button
                onClick={handleGenerateRecommendation}
                disabled={generatingRecommendation || selectedCourses.length === 0}
                className="btn bg-white text-primary-600 hover:bg-gray-100 flex items-center space-x-2 px-6 py-3"
              >
                {generatingRecommendation ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Generar Recomendación</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedMalla && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Selecciona una malla para comenzar
          </h3>
          <p className="text-gray-600">
            Elige tu malla curricular para ver los cursos disponibles
          </p>
        </div>
      )}
    </div>
  );
}
