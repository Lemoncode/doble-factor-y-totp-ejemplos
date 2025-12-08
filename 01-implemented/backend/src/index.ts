import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";
import { connectDB, getDB } from "./db/connection";
import { User, hashPassword, comparePassword, RecoveryCode } from "./models/User";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";
import crypto from "crypto";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Función para generar recovery codes
const generateRecoveryCodes = async (count: number = 6): Promise<{ plain: string[]; hashed: RecoveryCode[] }> => {
  const plainCodes: string[] = [];
  const hashedCodes: RecoveryCode[] = [];

  for (let i = 0; i < count; i++) {
    // Generar código aleatorio de 8 caracteres
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    plainCodes.push(code);

    // Hashear el código
    const hashedCode = await bcrypt.hash(code, 10);
    hashedCodes.push({
      code: hashedCode,
      used: false,
    });
  }

  return { plain: plainCodes, hashed: hashedCodes };
};

// Tipos para las peticiones
interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

// Endpoint de login
app.post(
  "/api/login",
  async (req: Request<{}, {}, LoginRequest>, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validación básica
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      const db = getDB();
      const usersCollection = db.collection<User>("users");

      // Buscar usuario por email
      const user = await usersCollection.findOne({
        email: email.toLowerCase(),
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Verificar contraseña
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
      }

      // Login exitoso
      res.json({
        success: true,
        message: "Login exitoso",
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            twoFactorEnabled: user.twoFactorEnabled || false,
          },
        },
      });
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).json({
        success: false,
        message: "Error del servidor",
      });
    }
  }
);

// Endpoint de signup
app.post(
  "/api/signup",
  async (req: Request<{}, {}, SignupRequest>, res: Response) => {
    try {
      const { email, password, name } = req.body;

      // Validación básica
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: "Nombre, email y contraseña son requeridos",
        });
      }

      const db = getDB();
      const usersCollection = db.collection<User>("users");

      // Verificar si el usuario ya existe
      const existingUser = await usersCollection.findOne({
        email: email.toLowerCase(),
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "El email ya está registrado",
        });
      }

      // Hash de la contraseña
      const hashedPassword = await hashPassword(password);

      // Crear nuevo usuario
      const newUser: User = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        twoFactorEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);

      res.status(201).json({
        success: true,
        message: "Usuario registrado exitosamente",
        data: {
          user: {
            id: result.insertedId,
            email: newUser.email,
            name: newUser.name,
            twoFactorEnabled: false,
          },
        },
      });
    } catch (error: any) {
      console.error("Error en signup:", error);

      res.status(500).json({
        success: false,
        message: "Error del servidor",
      });
    }
  }
);

// Endpoint para generar secret y QR code para 2FA
app.post("/api/2fa/setup", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId es requerido",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Generar secret
    const secret = new OTPAuth.Secret({ size: 20 });

    // Crear TOTP
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: secret,
    });

    // Generar URL otpauth
    const otpauthUrl = totp.toString();

    // Generar QR code
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Guardar el secret en la base de datos (aún no habilitado)
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          twoFactorSecret: secret.base32,
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      data: {
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
      },
    });
  } catch (error) {
    console.error("Error en setup 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
});

// Endpoint para verificar código 2FA
app.post("/api/2fa/verify", async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: "userId y código son requeridos",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "2FA no configurado para este usuario",
      });
    }

    // Primero intentar validar como código TOTP
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
    });

    const delta = totp.validate({ token: code, window: 1 });

    // Si es un código TOTP válido
    if (delta !== null) {
      return res.json({
        success: true,
        message: "Código verificado correctamente",
      });
    }

    // Si no es TOTP, intentar con recovery codes
    if (user.recoveryCodes && user.recoveryCodes.length > 0) {
      for (let i = 0; i < user.recoveryCodes.length; i++) {
        const recoveryCode = user.recoveryCodes[i];
        
        // Saltar si el código no existe o ya fue usado
        if (!recoveryCode || recoveryCode.used) {
          continue;
        }

        // Verificar si el código coincide
        const isMatch = await bcrypt.compare(code, recoveryCode.code);

        if (isMatch) {
          // Marcar el código como usado
          await usersCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                [`recoveryCodes.${i}.used`]: true,
                updatedAt: new Date(),
              },
            }
          );

          return res.json({
            success: true,
            message: "Código de recuperación verificado correctamente",
            data: {
              isRecoveryCode: true,
            },
          });
        }
      }
    }

    // Si llegamos aquí, ni TOTP ni recovery code fueron válidos
    return res.status(401).json({
      success: false,
      message: "Código incorrecto o expirado",
    });
  } catch (error) {
    console.error("Error en verificación 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
});

// Endpoint para habilitar 2FA después de verificar el código
app.post("/api/2fa/enable", async (req: Request, res: Response) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: "userId y código son requeridos",
      });
    }

    const db = getDB();
    const usersCollection = db.collection<User>("users");

    // Buscar usuario
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "Primero debes generar el código QR",
      });
    }

    // Crear TOTP con el secret del usuario
    const totp = new OTPAuth.TOTP({
      issuer: "MiApp",
      label: user.email,
      algorithm: "SHA1",
      digits: 6,
      period: 30,
      secret: OTPAuth.Secret.fromBase32(user.twoFactorSecret),
    });

    // Validar el código
    const delta = totp.validate({ token: code, window: 1 });

    if (delta === null) {
      return res.status(401).json({
        success: false,
        message: "Código incorrecto o expirado",
      });
    }

    // Generar recovery codes
    const { plain: plainRecoveryCodes, hashed: hashedRecoveryCodes } = await generateRecoveryCodes(6);

    // Habilitar 2FA y guardar recovery codes
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          twoFactorEnabled: true,
          recoveryCodes: hashedRecoveryCodes,
          updatedAt: new Date(),
        },
      }
    );

    res.json({
      success: true,
      message: "Autenticación de dos factores habilitada correctamente",
      data: {
        recoveryCodes: plainRecoveryCodes,
      },
    });
  } catch (error) {
    console.error("Error al habilitar 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Error del servidor",
    });
  }
});

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
