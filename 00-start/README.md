# Proyecto Full Stack - React + Express

Proyecto completo con frontend React y backend Express con TypeScript.

## Estructura del proyecto

```
00-start/
├── frontend/          # Aplicación React con Vite
│   ├── src/
│   │   ├── pages/    # Páginas de la aplicación
│   │   ├── App.tsx   # Configuración de rutas
│   │   └── main.tsx  # Punto de entrada
│   └── package.json
├── backend/           # API REST con Express
│   ├── src/
│   │   └── index.ts  # Servidor y endpoints
│   └── package.json
└── README.md
```

## Inicio rápido

### 1. Instalar dependencias

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Iniciar en modo desarrollo

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Tecnologías

### Frontend
- React 19
- TypeScript
- Vite 7
- Tailwind CSS v4
- DaisyUI
- React Router DOM

### Backend
- Node.js
- Express 5
- TypeScript
- CORS

## Características

✅ Configuración completa de TypeScript en frontend y backend  
✅ Tailwind CSS v4 con DaisyUI configurado  
✅ Proxy de Vite para evitar CORS  
✅ Endpoints de autenticación (login y signup)  
✅ Rutas protegidas con React Router  
✅ Hot reload en desarrollo

## Próximos pasos

- [ ] Implementar autenticación real con JWT
- [ ] Conectar frontend con backend
- [ ] Agregar validación de formularios
- [ ] Implementar base de datos
- [ ] Agregar manejo de errores
