import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Tipos para las peticiones
interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

// Endpoint de login
app.post("/api/login", (req: Request<{}, {}, LoginRequest>, res: Response) => {
  const { email, password } = req.body;

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email y contraseña son requeridos",
    });
  }

  // TODO: Aquí iría la lógica real de autenticación
  // Por ahora, solo devolvemos una respuesta de ejemplo
  res.json({
    success: true,
    message: "Login exitoso",
    data: {
      user: {
        email,
        name: "Usuario de ejemplo",
      },
      token: "ejemplo-token-jwt",
    },
  });
});

// Endpoint de signup
app.post(
  "/api/signup",
  (req: Request<{}, {}, SignupRequest>, res: Response) => {
    const { email, password, name } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email y contraseña son requeridos",
      });
    }

    // TODO: Aquí iría la lógica real de registro
    // Por ahora, solo devolvemos una respuesta de ejemplo
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        user: {
          email,
          name: name || "Usuario",
        },
      },
    });
  }
);

// Endpoint de salud
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api`);
});
