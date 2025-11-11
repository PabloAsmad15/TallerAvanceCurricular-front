import { useState, useEffect } from 'react';
import { Users, TrendingUp, BarChart3, Activity, Clock, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import { 
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const COLORS = ['#7C3AED', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recomendacionesStats, setRecomendacionesStats] = useState(null);
  const [recomendacionesRecientes, setRecomendacionesRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, recientesRes, recStatsRes] = await Promise.all([
        adminAPI.getGeneralStats(),
        adminAPI.getRecomendacionesRecientes(5),
        adminAPI.getRecomendacionesStats()
      ]);
      
      setStats(statsRes.data);
      setRecomendacionesRecientes(recientesRes.data.recomendaciones);
      setRecomendacionesStats(recStatsRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      if (error.response?.status === 403) {
        toast.error('No tienes permisos de administrador');
      } else {
        toast.error('Error al cargar estadísticas');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">No se pudieron cargar las estadísticas</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráficos
  const algoritmosData = [
    { 
      nombre: 'Prog. Restricciones', 
      value: stats.algoritmos.constraint_programming.total,
      porcentaje: stats.algoritmos.constraint_programming.porcentaje
    },
    { 
      nombre: 'Backtracking', 
      value: stats.algoritmos.backtracking.total,
      porcentaje: stats.algoritmos.backtracking.porcentaje
    }
  ];

  const usuariosData = [
    { nombre: 'Activos', value: stats.usuarios.activos },
    { nombre: 'Inactivos', value: stats.usuarios.inactivos }
  ];

  const topUsuariosData = stats.usuarios_mas_activos.map(u => ({
    nombre: u.nombre_completo.split(' ')[0],
    recomendaciones: u.recomendaciones
  }));

  const mallasData = recomendacionesStats?.por_malla.map(m => ({
    nombre: `Malla ${m.anio}`,
    cantidad: m.cantidad
  })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-primary-600">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard de Administración</h1>
        <p className="text-gray-600">Estadísticas y métricas del sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Usuarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-gray-900">{stats.usuarios.total}</p>
              <p className="text-xs text-gray-500">{stats.usuarios.activos} activos</p>
            </div>
          </div>
        </div>

        {/* Total Recomendaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recomendaciones</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recomendaciones.total}</p>
              <p className="text-xs text-gray-500">{stats.recomendaciones.ultimos_7_dias} últimos 7 días</p>
            </div>
          </div>
        </div>

        {/* Cursos */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.datos_academicos.total_cursos}</p>
              <p className="text-xs text-gray-500">{stats.datos_academicos.total_mallas} mallas</p>
            </div>
          </div>
        </div>

        {/* Promedio */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recomendaciones.promedio_cursos_por_recomendacion}</p>
              <p className="text-xs text-gray-500">por recomendación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Algoritmos Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Algoritmos - Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Algoritmos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={algoritmosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, porcentaje }) => `${nombre}: ${porcentaje}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {algoritmosData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {algoritmosData.map((alg, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index] }}
                  ></div>
                  <span className="text-gray-700">{alg.nombre}</span>
                </div>
                <span className="font-semibold text-gray-900">{alg.value} usos</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de Usuarios Activos vs Inactivos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Estado de Usuarios</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={usuariosData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ nombre, value }) => `${nombre}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2 bg-green-500"></div>
                <span className="text-gray-700">Activos</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.usuarios.activos}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full mr-2 bg-red-500"></div>
                <span className="text-gray-700">Inactivos</span>
              </div>
              <span className="font-semibold text-gray-900">{stats.usuarios.inactivos}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos de Barras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Usuarios Más Activos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Usuarios Más Activos</h2>
          {topUsuariosData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topUsuariosData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="recomendaciones" fill="#7C3AED" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
          )}
        </div>

        {/* Recomendaciones por Malla */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recomendaciones por Malla</h2>
          {mallasData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mallasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cantidad" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay datos disponibles</p>
          )}
        </div>
      </div>

      {/* Gráfico de Línea - Tendencia de Recomendaciones */}
      {recomendacionesStats?.recomendaciones_diarias && recomendacionesStats.recomendaciones_diarias.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Recomendaciones (Últimos 30 días)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={recomendacionesStats.recomendaciones_diarias}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="fecha" 
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                content={<CustomTooltip />}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#7C3AED" 
                strokeWidth={2}
                name="Recomendaciones"
                dot={{ fill: '#7C3AED', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recomendaciones Recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recomendaciones Recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Malla</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Algoritmo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cursos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tiempo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recomendacionesRecientes.map((rec) => (
                <tr key={rec.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{rec.usuario.nombre}</div>
                      <div className="text-sm text-gray-500">{rec.usuario.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Malla {rec.malla.anio}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      rec.algoritmo === 'constraint_programming' 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rec.algoritmo === 'constraint_programming' ? 'CP' : 'BT'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {rec.total_cursos_recomendados}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {rec.tiempo_ejecucion?.toFixed(2)}s
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(rec.created_at).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
