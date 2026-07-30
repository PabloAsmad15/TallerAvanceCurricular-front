# 🎨 NatiGravity - Frontend (React + Vite + Chakra UI)

Interfaz de usuario para el Asesor Curricular UPAO.

## 🚀 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local de Vite (por defecto en `http://localhost:5173`).
- `npm run build`: Compila la aplicación optimizada para producción en la carpeta `dist/`.
- `npm run preview`: Previsualiza localmente el build de producción.
- `npm run lint`: Ejecuta ESLint para validar el código.

## ⚙️ Configuración de Producción

Crea un archivo `.env.local` o configura la variable en tu servicio de hosting (ej. Vercel, Netlify):

```env
VITE_API_URL=https://tu-backend-api.onrender.com
```

## 📐 Sistema de Diseño

El sistema de diseño utiliza **Chakra UI** extendido en `src/theme.js`, configurado con los colores institucionales UPAO (`brand.500: #147bff`), componentes responsivos y estados de interacción.
