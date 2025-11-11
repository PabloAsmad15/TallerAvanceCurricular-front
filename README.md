# Frontend - Sistema de Recomendación Curricular UPAO

> ⚛️ **Aplicación web moderna** construida con React 18, Vite y Tailwind CSS para gestionar recomendaciones curriculares de forma intuitiva.

## � Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Componentes Principales](#-componentes-principales)
- [Gestión de Estado](#-gestión-de-estado)
- [Rutas](#-rutas)

## 🚀 Características

- **UI Moderna y Responsiva** con Tailwind CSS
- **Autenticación completa**: Login, Registro, Recuperación de contraseña
- **Selección interactiva de cursos** por ciclo (1-10)
- **Checkbox masivo** para marcar/desmarcar todos los cursos de un ciclo
- **4 Mallas curriculares completas**: 2015, 2019, 2022, 2025
- **Recomendaciones en tiempo real** del agente de IA
- **Historial de recomendaciones** con filtros
- **Dashboard de Administrador** con gráficos estadísticos (Recharts)
- **Dashboard personalizado** con métricas
- **Sistema de notificaciones** con toast
- **Navegación protegida** con autenticación
- **Redirección automática** según tipo de usuario (admin/regular)

## 📋 Requisitos Previos

- **Node.js** 18.0 o superior
- **npm** 9.0 o superior (incluido con Node.js)
- **Backend API** corriendo en http://localhost:8000

## 🔧 Instalación

1. **Clonar el repositorio**:
```bash
git clone <url-repositorio-frontend>
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Verificar instalación**:
```bash
npm list react react-dom vite
```

## ⚙️ Configuración

1. **Copiar archivo de configuración**:
```bash
cp .env.example .env
```

2. **Editar `.env` con la URL de tu backend**:
```env
VITE_API_URL=http://localhost:8000/api
```

### Variables de Entorno Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `VITE_API_URL` | URL base del backend API | `http://localhost:8000/api` |

**Nota:** Las variables en Vite deben empezar con `VITE_` para ser expuestas al cliente.

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

### Modo Producción

1. **Construir**:
```bash
npm run build
```

2. **Preview** (opcional, para probar el build):
```bash
npm run preview
```

3. **Servir archivos estáticos**:
Los archivos optimizados estarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend/
├── public/                        # Archivos estáticos
│   └── vite.svg
├── src/
│   ├── assets/                    # Imágenes, fuentes, etc.
│   ├── components/                # Componentes reutilizables
│   │   └── layout/
│   │       └── Layout.jsx        # Layout principal con navbar
│   ├── data/                      # Datos estáticos
│   │   └── cursosPorMalla.js     # 4 mallas completas con cursos
│   ├── pages/                     # Páginas/Vistas
│   │   ├── Login.jsx             # Login de usuarios
│   │   ├── Register.jsx          # Registro
│   │   ├── ForgotPassword.jsx    # Recuperar contraseña
│   │   ├── ResetPassword.jsx     # Cambiar contraseña
│   │   ├── Dashboard.jsx         # Inicio/Bienvenida
│   │   ├── SelectCourses.jsx     # Selección de cursos aprobados
│   │   ├── Recommendations.jsx   # Ver recomendación generada
│   │   ├── History.jsx           # Historial de recomendaciones
│   │   └── AdminDashboard.jsx    # Dashboard admin con gráficos
│   ├── services/                  # Servicios/API
│   │   └── api.js                # Cliente Axios configurado
│   ├── store/                     # Estado global (Zustand)
│   │   ├── authStore.js          # Estado de autenticación
│   │   └── recommendationStore.js # Estado de recomendaciones
│   ├── App.jsx                    # Componente raíz con rutas
│   ├── index.css                  # Estilos globales + Tailwind
│   └── main.jsx                   # Entry point
├── .env.example                   # Template de configuración
├── .gitignore                     # Archivos ignorados
├── index.html                     # HTML base
├── package.json                   # Dependencias y scripts
├── postcss.config.js              # Configuración PostCSS
├── tailwind.config.js             # Configuración Tailwind
├── vite.config.js                 # Configuración Vite
└── README.md                      # Este archivo
```

## 🧩 Componentes Principales

### AdminDashboard.jsx
Dashboard exclusivo para administradores con visualizaciones gráficas.

**Características:**
- **Tarjetas de estadísticas**: Usuarios, Recomendaciones, Cursos, Promedio
- **Gráfico de Pastel**: Distribución de algoritmos (CP vs Backtracking)
- **Gráfico de Pastel**: Estado de usuarios (Activos vs Inactivos)
- **Gráfico de Barras**: Top 5 usuarios más activos
- **Gráfico de Barras**: Recomendaciones por malla curricular
- **Gráfico de Línea**: Tendencia de recomendaciones (últimos 30 días)
- **Tabla**: Recomendaciones recientes con detalles
- Protegido con `is_admin=true`

### SelectCourses.jsx
Página para seleccionar cursos aprobados con datos embebidos de las 4 mallas.

**Características:**
- Selector de malla (2015, 2019, 2022, 2025)
- Cursos agrupados por ciclo (1-10)
- **Checkbox "Seleccionar todos"** por cada ciclo
- Checkboxes para marcar aprobados individuales
- Barra de progreso
- Datos desde `src/data/cursosPorMalla.js`

### Recommendations.jsx
Muestra la recomendación del agente de IA.

**Características:**
- Badge del algoritmo usado
- Cursos priorizados (Alta, Media, Baja)
- Razones de cada recomendación

### Layout.jsx
Layout principal con navegación.

**Características:**
- Navbar responsiva
- Dropdown de usuario
- Protección de rutas

## 🔄 Gestión de Estado (Zustand)

### authStore.js
```javascript
{
  user: null,
  token: null,
  isAuthenticated: false,
  login: (email, password) => {},
  logout: () => {}
}
```

### recommendationStore.js
```javascript
{
  selectedMalla: null,
  selectedCourses: [],
  currentRecommendation: null,
  toggleCourse: (courseId) => {}
}
```

## 🛣️ Rutas

| Ruta | Componente | Protegida | Admin |
|------|-----------|-----------|-------|
| `/` | Dashboard | ✅ | ❌ |
| `/login` | Login | ❌ | ❌ |
| `/register` | Register | ❌ | ❌ |
| `/forgot-password` | ForgotPassword | ❌ | ❌ |
| `/reset-password` | ResetPassword | ❌ | ❌ |
| `/select-courses` | SelectCourses | ✅ | ❌ |
| `/recommendations` | Recommendations | ✅ | ❌ |
| `/history` | History | ✅ | ❌ |
| `/admin` | AdminDashboard | ✅ | ✅ |

## 🎨 Tecnologías

- **React 18** - Framework UI moderno
- **Vite** - Build tool ultra rápido
- **React Router** - Enrutamiento SPA
- **Axios** - Cliente HTTP con interceptores
- **Zustand** - State management ligero
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos SVG optimizados
- **React Hot Toast** - Notificaciones elegantes
- **Recharts** - Gráficos interactivos y responsivos

## � Datos de Cursos

Las 4 mallas están completamente embebidas en `src/data/cursosPorMalla.js`:

- **Malla 2015**: 68 cursos, 10 ciclos
- **Malla 2019**: 68 cursos, 10 ciclos
- **Malla 2022**: 66 cursos, 10 ciclos
- **Malla 2025**: 62 cursos, 10 ciclos

Esto permite:
✅ Carga instantánea sin llamadas al backend
✅ Funcionamiento offline de la selección
✅ Mejor experiencia de usuario

##  Flujo de Usuario

### Usuario Regular
1. **Registro/Login** → Email @upao.edu.pe requerido
2. **Redirigido a Dashboard** → Vista principal
3. **Seleccionar Malla** → Elegir 2015, 2019, 2022 o 2025
4. **Marcar Cursos** → Expandir ciclos y seleccionar aprobados (checkbox masivo disponible)
5. **Generar Recomendación** → El agente IA analiza y recomienda
6. **Ver Resultados** → Cursos priorizados con justificación
7. **Historial** → Revisar recomendaciones anteriores

### Usuario Administrador
1. **Login con cuenta admin** → admin1502@upao.edu.pe
2. **Redirigido a /admin** → Dashboard administrativo automáticamente
3. **Ver Estadísticas**:
   - Total de usuarios (activos/inactivos)
   - Total de recomendaciones generadas
   - Distribución de algoritmos usados
   - Top usuarios más activos
   - Tendencia de uso por malla
   - Recomendaciones recientes
4. **Gráficos Interactivos** → Visualización con Recharts

## 🏗️ Build para Producción

```bash
# Construir
npm run build

# Archivos en dist/
# Subir a Vercel, Netlify, o servidor estático
```

## 🐳 Docker

```bash
# Construir imagen
docker build -t upao-frontend .

# Ejecutar contenedor
docker run -p 80:80 upao-frontend
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Subir carpeta dist/ en Netlify
```

### GitHub Pages
```bash
# Configurar base en vite.config.js
base: '/nombre-repo/'
npm run build
# Deploy dist/ a gh-pages branch
```

## 🔒 Seguridad

- ✅ Tokens JWT en localStorage
- ✅ Validación @upao.edu.pe
- ✅ Rutas protegidas con autenticación
- ✅ HTTPS en producción
- ✅ Variables de entorno con VITE_

## 🐛 Troubleshooting

### Error: "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Network Error"
```bash
# Verificar backend esté corriendo
# Verificar VITE_API_URL en .env
# Verificar CORS en backend
```

## 📚 Recursos

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Router](https://reactrouter.com/)

## 📧 Soporte

1. Verificar que backend esté corriendo en http://localhost:8000
2. Revisar consola del navegador
3. Verificar variables de entorno VITE_*

## 📝 Licencia

MIT
