import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Sparkles, Loader, BookOpen, Plus, X, ChartBar } from 'lucide-react';
import toast from 'react-hot-toast';
import { mallasAPI, cursosAPI, recomendacionesAPI } from '../services/api';
import { useRecommendationStore } from '../store/recommendationStore';

export default function SelectCoursesMultiMalla() {
  const navigate = useNavigate();
  const {
    setCurrentRecommendation,
  } = useRecommendationStore();

  const mallasDisponibles = [
    { id: 1, nombre: "Malla Curricular 2015", anio: 2015 },
    { id: 2, nombre: "Malla Curricular 2019", anio: 2019 },
    { id: 3, nombre: "Malla Curricular 2022", anio: 2022 },
    { id: 4, nombre: "Malla Curricular 2025", anio: 2025 }
  ];

  // Malla destino (siempre 2025 - la más reciente)
  const mallaDestino = mallasDisponibles.find(m => m.anio === 2025);

  // Estado: Lista de mallas seleccionadas con sus cursos
  const [mallasSeleccionadas, setMallasSeleccionadas] = useState([]);
  
  // Estado actual de malla siendo editada
  const [mallaActual, setMallaActual] = useState(null);
  const [cursosPorCiclo, setCursosPorCiclo] = useState([]);
  const [cursosSeleccionados, setCursosSeleccionados] = useState([]);
  const [expandedCiclos, setExpandedCiclos] = useState([1, 2, 3]);
  
  const [generatingRecommendation, setGeneratingRecommendation] = useState(false);
  // NUEVO: prerequisitos de cursos de la malla actual
  const [prerequisitosMap, setPrerequisitosMap] = useState({}); // {codigo: [prereq1, ...]}
  const [errorCargaCursos, setErrorCargaCursos] = useState("");
  const [errorCompararAlgoritmos, setErrorCompararAlgoritmos] = useState("");

  // Agregar una malla al listado
  const agregarMalla = (malla) => {
    if (mallasSeleccionadas.find(m => m.id === malla.id)) {
      toast.error('Esta malla ya fue agregada');
      return;
    }
    
    setMallaActual(malla);
    setCursosSeleccionados([]);
    loadCursos(malla);
  };

  // Cargar cursos y prerequisitos de una malla
  const loadCursos = async (malla) => {
    setErrorCargaCursos("");
    try {
      const [cursosResp, prereqResp] = await Promise.all([
        cursosAPI.getByCiclo(malla.id),
        cursosAPI.getPrerequisitos(malla.id)
      ]);
      setCursosPorCiclo(cursosResp.data);
      setPrerequisitosMap(prereqResp.data); // {codigo: [prereq1, ...]}
    } catch (error) {
      console.error('Error cargando cursos/prerequisitos:', error);
      setErrorCargaCursos('No se pudieron cargar los cursos o prerequisitos. Intenta más tarde.');
      setCursosPorCiclo([]);
      setPrerequisitosMap({});
      toast.error('Error al cargar cursos o prerequisitos');
    }
  };

  const toggleCourse = (courseCode) => {
    if (cursosSeleccionados.includes(courseCode)) {
      if (!puedeDesmarcar(courseCode)) {
        toast.error('No puedes desmarcar este curso porque es prerequisito de otro seleccionado');
        return;
      }
      setCursosSeleccionados(cursosSeleccionados.filter(c => c !== courseCode));
    } else {
      const nuevos = Array.from(marcarConPrereqs(courseCode));
      setCursosSeleccionados(nuevos);
    }
  };

  // Marcar curso y todos sus prerequisitos recursivamente
  const marcarConPrereqs = (codigo, seleccionados = new Set(cursosSeleccionados)) => {
    if (seleccionados.has(codigo)) return seleccionados;
    seleccionados.add(codigo);
    (prerequisitosMap[codigo] || []).forEach(pr => marcarConPrereqs(pr, seleccionados));
    return seleccionados;
  };

  // Desmarcar curso solo si no es prerequisito de otro seleccionado
  const puedeDesmarcar = (codigo) => {
    return !cursosSeleccionados.some(c => (prerequisitosMap[c] || []).includes(codigo));
  };

  const toggleCiclo = (ciclo) => {
    if (expandedCiclos.includes(ciclo)) {
      setExpandedCiclos(expandedCiclos.filter(c => c !== ciclo));
    } else {
      setExpandedCiclos([...expandedCiclos, ciclo]);
    }
  };

  // Marcar/desmarcar ciclo completo
  const toggleCicloCompleto = (ciclo, cursos) => {
    const todosSeleccionados = cursos.every(c => cursosSeleccionados.includes(c.codigo));
    if (todosSeleccionados) {
      let nuevos = [...cursosSeleccionados];
      for (const curso of cursos) {
        if (puedeDesmarcar(curso.codigo)) {
          nuevos = nuevos.filter(c => c !== curso.codigo);
        }
      }
      setCursosSeleccionados(nuevos);
    } else {
      let nuevos = new Set(cursosSeleccionados);
      for (const curso of cursos) {
        marcarConPrereqs(curso.codigo, nuevos);
      }
      setCursosSeleccionados(Array.from(nuevos));
    }
  };

  const handleGenerateRecommendation = async () => {
    setErrorCompararAlgoritmos("");
    if (mallasSeleccionadas.length === 0) {
      toast.error('Debes agregar al menos una malla con cursos');
      return;
    }
    setGeneratingRecommendation(true);
    try {
      // Construir array de cursos con su malla de origen
      const cursosMultiMalla = [];
      mallasSeleccionadas.forEach(malla => {
        malla.cursos.forEach(codigo => {
          cursosMultiMalla.push({
            codigo: codigo,
            malla_origen_anio: malla.anio
          });
        });
      });

      console.log('Generando recomendación con cursos de múltiples mallas:', cursosMultiMalla);

      const response = await recomendacionesAPI.create({
        malla_id: mallaDestino.id,  // Siempre recomendar para 2025
        cursos_aprobados: [],  // No usado en modo multi-malla
        cursos_aprobados_multi_malla: cursosMultiMalla
      });

      setCurrentRecommendation(response.data);
      toast.success('Recomendación generada exitosamente');
      navigate('/recommendations');
    } catch (error) {
      console.error('Error al generar recomendación:', error);
      const errorMsg = error.response?.data?.detail?.mensaje || error.response?.data?.detail || error.message || 'Error al generar recomendación';
      setErrorCompararAlgoritmos('No se pudo generar la recomendación. Puede ser un problema de conexión o del servidor.');
      toast.error(errorMsg);
    } finally {
      setGeneratingRecommendation(false);
    }
  };

  const totalCursosSeleccionados = mallasSeleccionadas.reduce((sum, m) => sum + m.cursos.length, 0);

  // En el return, antes de mostrar la UI principal:
  if (errorCargaCursos) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">{errorCargaCursos}</h3>
        <button onClick={() => loadCursos(mallaActual)} className="btn bg-blue-600 text-white mt-4">Reintentar</button>
      </div>
    );
  }

  // Guardar cursos de la malla actual
  const guardarCursosMalla = () => {
    if (cursosSeleccionados.length === 0) {
      toast.error('Debes seleccionar al menos un curso');
      return;
    }
    for (const codigo of cursosSeleccionados) {
      const faltan = (prerequisitosMap[codigo] || []).filter(pr => !cursosSeleccionados.includes(pr));
      if (faltan.length > 0) {
        toast.error(`El curso ${codigo} requiere que selecciones también: ${faltan.join(', ')}`);
        return;
      }
    }
    const mallaConCursos = {
      ...mallaActual,
      cursos: cursosSeleccionados
    };
    setMallasSeleccionadas([...mallasSeleccionadas, mallaConCursos]);
    setMallaActual(null);
    setCursosPorCiclo([]);
    setCursosSeleccionados([]);
    setPrerequisitosMap({});
    toast.success(`Cursos de malla ${mallaActual.anio} guardados`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <h2 className="text-2xl font-bold mb-2">Selección de Cursos - Múltiples Mallas</h2>
        <p className="text-blue-100">
          Selecciona cursos que has aprobado de diferentes mallas curriculares. 
          El sistema los convalidará automáticamente hacia la malla 2025.
        </p>
      </div>

      {/* Resumen de mallas seleccionadas */}
      {mallasSeleccionadas.length > 0 && (
        <div className="card bg-green-50 border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Mallas Agregadas ({mallasSeleccionadas.length})
          </h3>
          
          <div className="space-y-3">
            {mallasSeleccionadas.map(malla => (
              <div key={malla.id} className="bg-white rounded-lg p-4 flex justify-between items-center border border-green-300">
                <div>
                  <span className="font-semibold text-gray-800">Malla {malla.anio}</span>
                  <span className="ml-3 text-sm text-gray-600">
                    {malla.cursos.length} cursos seleccionados
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {malla.cursos.slice(0, 5).map((codigo, idx) => (
                      <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        {codigo}
                      </span>
                    ))}
                    {malla.cursos.length > 5 && (
                      <span className="text-xs text-gray-500">
                        +{malla.cursos.length - 5} más
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => eliminarMalla(malla.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selector de malla */}
      {!mallaActual && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Agregar Malla</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mallasDisponibles.map(malla => {
              const yaSeleccionada = mallasSeleccionadas.find(m => m.id === malla.id);
              const esMallaDestino = malla.id === mallaDestino.id;
              
              return (
                <button
                  key={malla.id}
                  onClick={() => !yaSeleccionada && agregarMalla(malla)}
                  disabled={yaSeleccionada}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    yaSeleccionada
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                      : esMallaDestino
                      ? 'border-purple-500 bg-purple-50 hover:bg-purple-100'
                      : 'border-blue-500 bg-blue-50 hover:bg-blue-100'
                  }`}
                >
                  <div className="text-center">
                    <span className="font-bold text-lg">{malla.anio}</span>
                    {esMallaDestino && (
                      <span className="block text-xs text-purple-600 font-semibold mt-1">
                        (Destino)
                      </span>
                    )}
                    {yaSeleccionada && (
                      <span className="block text-xs text-gray-500 mt-1">
                        ✓ Agregada
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selección de cursos de la malla actual */}
      {mallaActual && (
        <>
          <div className="card bg-blue-50 border-2 border-blue-300">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-blue-800">
                  Seleccionando cursos de Malla {mallaActual.anio}
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                  {cursosSeleccionados.length} cursos seleccionados
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMallaActual(null);
                    setCursosPorCiclo([]);
                    setCursosSeleccionados([]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarCursosMalla}
                  disabled={cursosSeleccionados.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar Cursos
                </button>
              </div>
            </div>
          </div>

          {/* Lista de cursos por ciclo */}
          <div className="space-y-4">
            {cursosPorCiclo.map(({ ciclo, cursos }) => {
              const todosSeleccionados = cursos.every(c => cursosSeleccionados.includes(c.codigo));
              const algunoSeleccionado = cursos.some(c => cursosSeleccionados.includes(c.codigo));
              const isExpanded = expandedCiclos.includes(ciclo);
              return (
                <div key={ciclo} className="card">
                  <div className="flex items-center p-4">
                    {/* Checkbox para seleccionar/deseleccionar todo el ciclo */}
                    <div
                      onClick={e => {
                        e.stopPropagation();
                        toggleCicloCompleto(ciclo, cursos);
                      }}
                      className="flex items-center justify-center w-6 h-6 mr-3 cursor-pointer"
                    >
                      {todosSeleccionados ? (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      ) : algunoSeleccionado ? (
                        <div className="w-6 h-6 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full bg-blue-600" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={() => toggleCiclo(ciclo)}
                      className="flex-1 flex items-center justify-between hover:bg-gray-50 rounded-lg transition-colors py-2"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {ciclo}
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-900">
                            Ciclo {ciclo}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {cursos.filter(c => cursosSeleccionados.includes(c.codigo)).length} de {cursos.length} cursos seleccionados
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
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-2">
                      {cursos.map(curso => (
                        <div
                          key={curso.id}
                          onClick={() => toggleCourse(curso.codigo)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            cursosSeleccionados.includes(curso.codigo)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                          title={
                            (prerequisitosMap[curso.codigo]?.length)
                              ? `Prerequisitos: ${prerequisitosMap[curso.codigo].join(', ')}`
                              : 'Sin prerequisitos'
                          }
                        >
                          <div className="flex items-start">
                            <div className="mt-1 mr-3">
                              {cursosSeleccionados.includes(curso.codigo) ? (
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-800">{curso.codigo}</span>
                                <span className="text-sm text-gray-600">{curso.creditos} créditos</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{curso.nombre}</p>
                              {prerequisitosMap[curso.codigo]?.length > 0 && (
                                <p className="text-xs text-blue-500 mt-1">Prerequisitos: {prerequisitosMap[curso.codigo].join(', ')}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Botones de acción final */}
      {!mallaActual && mallasSeleccionadas.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold mb-1">¿Listo para la recomendación?</h3>
              <p className="text-sm text-primary-100">
                Has seleccionado {totalCursosSeleccionados} cursos de {mallasSeleccionadas.length} mallas diferentes
              </p>
              <p className="text-xs text-primary-200 mt-1">
                Se convalidarán automáticamente hacia Malla 2025
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/compare-algorithms', {
                  state: {
                    mallaId: mallaDestino.id,
                    cursosAprobadosMultiMalla: mallasSeleccionadas.flatMap(m =>
                      m.cursos.map(codigo => ({
                        codigo,
                        malla_origen_anio: m.anio
                      }))
                    )
                  }
                })}
                className="btn bg-white/90 text-primary-600 hover:bg-white flex items-center space-x-2 px-6 py-3"
              >
                <ChartBar className="w-5 h-5" />
                <span>Comparar Algoritmos</span>
              </button>
              <button
                onClick={handleGenerateRecommendation}
                disabled={generatingRecommendation}
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
      {!mallaActual && mallasSeleccionadas.length === 0 && (
        <div className="card text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Comienza agregando una malla
          </h3>
          <p className="text-gray-600">
            Selecciona las mallas de las cuales has cursado y aprobado materias
          </p>
        </div>
      )}

      {/* Justo antes del botón de comparar algoritmos */}
      {errorCompararAlgoritmos && (
        <div className="bg-red-100 text-red-700 rounded p-2 mb-2 text-sm font-semibold">
          {errorCompararAlgoritmos}
        </div>
      )}
    </div>
  );
}
