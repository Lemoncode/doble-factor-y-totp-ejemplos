# Proyecto Full Stack - React + Express + MongoDB

Proyecto completo con frontend React, backend Express con TypeScript y MongoDB para autenticación de usuarios.

## Estructura del proyecto

```
00-start/
├── frontend/          # Aplicación React con Vite
│   ├── src/
│   │   ├── pages/    # Páginas: Login, Signup, Welcome
│   │   ├── App.tsx   # Configuración de rutas
│   │   └── main.tsx  # Punto de entrada
│   └── package.json
├── backend/           # API REST con Express
│   ├── src/
│   │   ├── models/   # Modelo de Usuario con Mongoose
│   │   ├── db/       # Configuración de MongoDB
│   │   └── index.ts  # Servidor y endpoints
│   ├── .env          # Variables de entorno
│   └── package.json
├── docker-compose.yml # MongoDB en Docker
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

### 2. Iniciar MongoDB con Docker

Desde la carpeta `frontend/` o `backend/`:

```bash
npm run docker:up
```

Esto levantará un contenedor de MongoDB en `localhost:27017` con las credenciales:

- Usuario: `admin`
- Contraseña: `admin123`
- Base de datos: `authdb`

### 3. Iniciar la aplicación completa

**Opción 1 - Todo en uno (recomendado):**

Desde la carpeta `frontend/`:

```bash
npm run dev:all
```

Esto iniciará automáticamente:

- MongoDB (si no está corriendo)
- Backend en `http://localhost:3000`
- Frontend en `http://localhost:5173`

**Opción 2 - Manualmente:**

Terminal 1 - Backend:

```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

### 4. Usar la aplicación

1. Abre tu navegador en `http://localhost:5173`
2. Regístrate en la página de Signup con:
   - Nombre
   - Email
   - Contraseña (mínimo 6 caracteres)
3. Inicia sesión con tus credenciales
4. Serás redirigido a la página de bienvenida

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
- MongoDB con Mongoose
- bcryptjs (hash de contraseñas)
- CORS
- dotenv

### Base de datos

- MongoDB 7 (Docker)

## Scripts disponibles

### Frontend (`frontend/`)

- `npm run dev` - Inicia solo el frontend
- `npm run dev:all` - Inicia MongoDB + backend + frontend
- `npm run docker:up` - Levanta MongoDB
- `npm run docker:down` - Detiene MongoDB
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción

### Backend (`backend/`)

- `npm run dev` - Inicia el servidor en modo desarrollo
- `npm run build` - Compila TypeScript
- `npm run start` - Ejecuta el servidor compilado
- `npm run docker:up` - Levanta MongoDB
- `npm run docker:down` - Detiene MongoDB
- `npm run docker:logs` - Ver logs de MongoDB

## Endpoints de la API

### POST /api/signup

Registra un nuevo usuario.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

### POST /api/login

Autentica un usuario existente.

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": "...",
      "email": "juan@example.com",
      "name": "Juan Pérez"
    }
  }
}
```

### GET /api/health

Health check del servidor.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-12-07T10:00:00.000Z"
}
```

## Características implementadas

✅ Autenticación completa con MongoDB  
✅ Contraseñas hasheadas con bcryptjs  
✅ Validación de formularios en frontend y backend  
✅ Mensajes de error/éxito con DaisyUI  
✅ Navegación con React Router  
✅ Proxy de Vite configurado (sin CORS)  
✅ MongoDB en Docker  
✅ Variables de entorno configuradas  
✅ TypeScript en todo el proyecto  
✅ Hot reload en desarrollo

## Detener la aplicación

Para detener MongoDB:

```bash
npm run docker:down
```

Para detener el servidor de desarrollo, presiona `Ctrl+C` en las terminales correspondientes.
