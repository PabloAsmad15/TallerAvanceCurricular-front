import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Sparkles, Loader, BookOpen } from 'lucide-react';
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
    // Mapa COMPLETO de prerequisitos desde la base de datos
    const prerequisitosCompletos = {
      'CIEN-539': ['CIEN-538'],
      'CIEN-597': ['ICSI-401', 'CIEN-397'],
      'CIEN-598': ['CIEN-597'],
      'CIEN-599': ['CIEN-397'],
      'CIEN-600': ['CIEN-599'],
      'CIEN-648': ['CIEN-539'],
      'CIEN-649': ['CIEN-599'],
      'CIEN-655': ['CIEN-651'],
      'CIEN-747': ['ISIA-105'],
      'CIEN-754': ['CIEN-753'],
      'CIEN-755': ['CIEN-754'],
      'CIEN-768': ['CIEN-752'],
      'CIEN-769': ['CIEN-768'],
      'HUMA-1020': ['HUMA-900'],
      'HUMA-1043': ['HUMA-903'],
      'HUMA-1180': ['HUMA-1179'],
      'HUMA-1182': ['HUMA-1180'],
      'HUMA-641': ['HUMA-640'],
      'HUMA-679': ['HUMA-641'],
      'HUMA-701': ['HUMA-679'],
      'HUMA-901': ['HUMA-899'],
      'HUMA-903': ['HUMA-1020', 'HUMA-901', 'HUMA-900'],
      'HUMA-904': ['HUMA-903'],
      'HUMA-905': ['HUMA-904'],
      'HUMA-906': ['HUMA-701', 'ICSI-423'],
      'ICSI': ['ICSI-509'],
      'ICSI-402': ['ICSI-400'],
      'ICSI-403': ['ICSI-402'],
      'ICSI-404': ['ICSI-401'],
      'ICSI-405': ['CIEN-539'],
      'ICSI-406': ['ICSI-403'],
      'ICSI-407': ['CIEN-600'],
      'ICSI-408': ['ICSI-405'],
      'ICSI-409': ['HUMA-901'],
      'ICSI-410': ['ICSI-406'],
      'ICSI-411': ['ICSI-407'],
      'ICSI-412': ['ICSI-403'],
      'ICSI-413': ['ICSI-410', 'ICSI-403'],
      'ICSI-414': ['ICSI-410'],
      'ICSI-415': ['INSO-135', 'ICSI-404'],
      'ICSI-416': ['ICSI-408'],
      'ICSI-417': ['ICSI-409'],
      'ICSI-418': ['ICSI-404', 'ICSI-413'],
      'ICSI-419': ['ICSI-415'],
      'ICSI-420': ['ICSI-416'],
      'ICSI-421': ['ICSI-415', 'ICSI-417'],
      'ICSI-422': ['CIEN-597', 'CIEN-600', 'CIEN-598'],
      'ICSI-423': ['HUMA-904'],
      'ICSI-424': ['ICSI-421'],
      'ICSI-425': ['ICSI-418', 'ICSI-422'],
      'ICSI-426': ['ICSI-420'],
      'ICSI-427': ['ICSI-421', 'ICSI-418'],
      'ICSI-428': ['HUMA-905'],
      'ICSI-431': ['ICSI-424', 'ICSI-427'],
      'ICSI-432': ['ICSI-418'],
      'ICSI-433': ['ICSI-426'],
      'ICSI-434': ['ICSI-428', 'ICSI-543'],
      'ICSI-438': ['ICSI-431', 'ICSI-432', 'ICSI-433', 'HUMA-906', 'ICSI-434', 'ICSI-528', 'ICSI-530', 'ICSI-531', 'ICSI-532'],
      'ICSI-439': ['ICSI-433'],
      'ICSI-440': ['ICSI-434'],
      'ICSI-509': ['ICSI-506'],
      'ICSI-510': ['ICSI-509'],
      'ICSI-511': ['ICSI-509'],
      'ICSI-512': ['ICSI-510'],
      'ICSI-514': ['CIEN-648'],
      'ICSI-518': ['ICSI-513'],
      'ICSI-519': ['ICSI-514'],
      'ICSI-520': ['ICSI-516'],
      'ICSI-521': ['ICSI-515', 'ICSI-673'],
      'ICSI-522': ['ICSI-516', 'ICSI-515', 'ICSI-517'],
      'ICSI-523': ['ICSI-518'],
      'ICSI-524': ['ICSI-519'],
      'ICSI-525': ['CIEN-649', 'CIEN-655'],
      'ICSI-526': ['ICSI-538'],
      'ICSI-527': ['ICSI-521'],
      'ICSI-528': ['ICSI-522'],
      'ICSI-529': ['ICSI-523'],
      'ICSI-530': ['ICSI-524'],
      'ICSI-531': ['ICSI-526'],
      'ICSI-532': ['ICSI-527'],
      'ICSI-538': ['ICSI-516'],
      'ICSI-539': ['CIEN-649', 'CIEN-655'],
      'ICSI-540': ['ICSI-528'],
      'ICSI-541': ['ICSI-523'],
      'ICSI-543': ['HUMA-1043'],
      'ICSI-544': ['ICSI-518', 'ICSI-522'],
      'ICSI-545': ['ICSI-531'],
      'ICSI-546': ['HUMA-1025'],
      'ICSI-552': ['ICSI-543'],
      'ICSI-553': ['ICSI-545'],
      'ICSI-557': ['ICSI-531'],
      'ICSI-558': ['ICSI-528', 'ICSI-530', 'ICSI-531', 'ICSI-532'],
      'ICSI-559': ['ICSI-552'],
      'ICSI-560': ['ICSI-540', 'ICSI-553', 'ICSI-551'],
      'ICSI-671': ['ICSI-509'],
      'ICSI-672': ['ADMI-779'],
      'ICSI-673': ['ICSI-671'],
      'ICSI-674': ['ICSI-672'],
      'ICSI-675': ['ICSI-671'],
      'ICSI-676': ['ISIA-106'],
      'ICSI-677': ['ICSI-530', 'ISIA-107', 'ISIA-109'],
      'ICSI-678': ['ISIA-112'],
      'ICSI-679': ['ICSI-678'],
      'INSO-135': ['ICSI-403'],
      'INSO-136': ['INSO-135'],
      'ISIA-101': ['CIEN-753'],
      'ISIA-103': ['ICSI-672'],
      'ISIA-104': ['ISIA-102'],
      'ISIA-105': ['ICSI-674', 'ICSI-673', 'ISIA-103'],
      'ISIA-106': ['ISIA-101'],
      'ISIA-107': ['ISIA-104'],
      'ISIA-108': ['ISIA-106'],
      'ISIA-109': ['ISIA-105'],
      'ISIA-110': ['ISIA-108', 'ICSI-676'],
      'ISIA-111': ['ISIA-108'],
      'ISIA-112': ['ISIA-109'],
      'ISIA-113': ['CIEN-747'],
      'ISIA-114': ['ICSI-672', 'ISIA-108'],
      'ISIA-115': ['ISIA-110'],
      'ISIA-116': ['ISIA-111', 'ICSI-676'],
      'ISIA-117': ['HUMA-1185'],
      'ISIA-118': ['ICSI-521'],
      'ISIA-119': ['ISIA-115'],
      'ISIA-120': ['ISIA-115'],
      'ISIA-121': ['ICSI-678'],
      'ISIA-125': ['ISIA-122'],
      'ISIA-126': ['ISIA-123'],
    };
    
    // Convalidaciones completas (cursos equivalentes entre mallas)
    const convalidacionesCompletas = {
      'ADMI-779': ['ICSI-409', 'ICSI-538'],
      'CIEN-746': ['ICSI-423', 'CIEN-662'],
      'CIEN-747': ['ICSI-441', 'ICSI-544'],
      'CIEN-752': ['CIEN-597'],
      'CIEN-753': ['CIEN-397'],
      'CIEN-754': ['CIEN-599'],
      'CIEN-755': ['CIEN-600', 'CIEN-649'],
      'CIEN-768': ['ICSI-405', 'CIEN-539'],
      'CIEN-769': ['ICSI-405', 'CIEN-648'],
      'HUMA-1179': ['HUMA-899'],
      'HUMA-1180': ['HUMA-901'],
      'HUMA-1182': ['HUMA-904', 'HUMA-1024'],
      'HUMA-1183': ['HUMA-701', 'HUMA-1027', 'HUMA-1012'],
      'HUMA-1184': ['HUMA-1038'],
      'HUMA-1185': ['HUMA-905', 'HUMA-1043'],
      'ICSI-506': ['ICSI-402', 'ICSI-506'],
      'ICSI-509': ['ICSI-403', 'ICSI-509'],
      'ICSI-521': ['ICSI-414', 'ICSI-521'],
      'ICSI-546': ['HUMA-906', 'ICSI-546'],
      'ICSI-671': ['ICSI-406'],
      'ICSI-672': ['ICSI-419', 'ICSI-516', 'ICSI-519'],
      'ICSI-673': ['ICSI-410', 'ICSI-515'],
      'ICSI-674': ['ICSI-513'],
      'ICSI-675': ['ICSI-510'],
      'ICSI-676': ['ICSI-422', 'ICSI-525', 'ICSI-539'],
      'ICSI-677': ['ICSI-439'],
      'ICSI-678': ['ICSI-424', 'ICSI-531'],
      'ICSI-679': ['ICSI-443', 'ICSI-540'],
      'ISIA-100': ['ICSI-401', 'ICSI-507'],
      'ISIA-101': ['CIEN-598', 'CIEN-651', 'CIEN-655'],
      'ISIA-102': ['ICSI-420', 'ICSI-524'],
      'ISIA-103': ['ICSI-418', 'ICSI-522'],
      'ISIA-104': ['ICSI-408', 'ICSI-514'],
      'ISIA-105': ['INSO-135', 'ICSI-518'],
      'ISIA-106': ['CIEN-655'],
      'ISIA-107': ['ICSI-433', 'ICSI-530'],
      'ISIA-109': ['INSO-136', 'ICSI-523'],
      'ISIA-110': ['ICSI-435', 'ICSI-551'],
      'ISIA-111': ['ICSI-432', 'ICSI-527'],
      'ISIA-113': ['INSO-137', 'ICSI-541'],
      'ISIA-116': ['ICSI-425', 'ICSI-532'],
      'ISIA-117': ['ICSI-428', 'ICSI-543'],
      'ISIA-118': ['ICSI-421', 'ICSI-526'],
      'ISIA-121': ['ICSI-412', 'ICSI-517'],
      'ISIA-122': ['ICSI-434', 'ICSI-552'],
      'ISIA-123': ['ICSI-560'],
      'ISIA-124': ['ICSI-438', 'ICSI-558'],
      'ISIA-125': ['ICSI-440', 'ICSI-559'],
      'ISIA-127': ['ICSI-436', 'ICSI-550'],
      'ISIA-128': ['ICSI-431', 'ICSI-547'],
      'ISIA-129': ['ICSI-444', 'ICSI-554', 'ICSI-546'],
      'ISIA-130': ['ICSI-548', 'ICSI-545'],
      'ISIA-131': ['ICSI-556'],
      'ISIA-132': ['ICSI-427', 'ICSI-553'],
      'ISIA-133': ['ICSI-426', 'ICSI-555'],
    };
    
    setPrerequisitosMap(prerequisitosCompletos);
    setConvalidacionesMap(convalidacionesCompletas);
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

  // Función para manejar la selección/deselección de cursos
  const handleToggleCourse = (cursoId) => {
    const isCurrentlySelected = selectedCourses.includes(cursoId);
    
    if (isCurrentlySelected) {
      // Deseleccionar el curso
      toggleCourse(cursoId);
    } else {
      // Verificar prerequisitos antes de seleccionar
      const prerequisitos = prerequisitosMap[cursoId] || [];
      
      // Verificar cada prerequisito, pero también aceptar convalidaciones
      const prerequisitosFaltantes = prerequisitos.filter(prereqCodigo => {
        // El prerequisito está cumplido si:
        // 1. El curso prerequisito ya está seleccionado
        if (selectedCourses.includes(prereqCodigo)) return false;
        
        // 2. O algún curso equivalente (convalidación) del prerequisito está seleccionado
        const cursosEquivalentes = convalidacionesMap[prereqCodigo] || [];
        const tieneEquivalente = cursosEquivalentes.some(equiv => selectedCourses.includes(equiv));
        
        return !tieneEquivalente; // Falta si no tiene ni el prerequisito ni equivalente
      });
      
      if (prerequisitosFaltantes.length > 0) {
        // Mostrar error indicando qué prerequisitos faltan
        const curso = cursosPorCiclo.flatMap(c => c.cursos).find(c => c.id === cursoId || c.codigo === cursoId);
        toast.error(
          `⚠️ No puedes seleccionar ${curso?.codigo || cursoId}.\nFaltan prerequisitos: ${prerequisitosFaltantes.join(', ')}`,
          { duration: 5000 }
        );
      } else {
        // Si tiene todos los prerequisitos (o sus equivalentes), marcar el curso
        toggleCourse(cursoId);
      }
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
      useRecommendationStore.setState({ selectedCourses: newSelected });
    } else {
      // Seleccionar todos los cursos de este ciclo con auto-marcado de prerequisitos
      let newSelected = [...selectedCourses];
      for (const cursoId of cursoIdsDelCiclo) {
        newSelected = autoMarcarPrerequisitos(cursoId, newSelected);
      }
      newSelected = [...new Set(newSelected)]; // Eliminar duplicados
      useRecommendationStore.setState({ selectedCourses: newSelected });
      toast.success(`Ciclo ${ciclo} marcado con sus prerequisitos`, { duration: 2000 });
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
      console.error('Error al generar recomendación:', error); // Solo para debugging en consola
      
      // Mensaje genérico y seguro para el usuario
      let userMessage = 'Ocurrió un error al generar la recomendación. Por favor, intenta nuevamente.';
      
      // Mostrar mensaje del backend solo si es amigable (errores de validación de prerequisitos)
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        // Si es un array (errores de validación), mostrarlo
        if (Array.isArray(detail)) {
          userMessage = detail.join('\n');
        } 
        // Si es un string que no contiene palabras técnicas, mostrarlo
        else if (typeof detail === 'string' && 
                 !detail.includes('Traceback') && 
                 !detail.includes('Exception') && 
                 !detail.toLowerCase().includes('internal')) {
          userMessage = detail;
        }
      }
      
      toast.error(userMessage, { duration: 5000 });
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
                            <div className="font-medium text-gray-900">
                              {curso.codigo}
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
