import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, payload);
    })
  );
}

export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// Registro de usuario
router.post(
  "/registro",
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 100 }),
  body("email", "Email inválido").isEmail(),
  body("password", "Contraseña inválida").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;

    // Verificar si el email ya existe
    const [usuarios] = await db.execute(
      "SELECT id FROM usuarios WHERE email=?",
      [email]
    );

    if (usuarios.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El email ya está registrado" });
    }

    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insertar usuario
    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?,?,?)",
      [nombre, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      data: { id: result.insertId, nombre, email },
    });
  }
);

// Login
router.post(
  "/login",
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  verificarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    // Consultar por el usuario a la base de datos
    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email inválido" });
    }

    // Verificar la contraseña
    const hashedPassword = usuarios[0].password_hash;

    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Contraseña inválida" });
    }

    // Generar jwt con expiración de 4 horas
    const payload = { userId: usuarios[0].id, email: usuarios[0].email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    // Devolver jwt y otros datos
    res.json({
      success: true,
      token,
      email: usuarios[0].email,
      nombre: usuarios[0].nombre,
    });
  }
);

export default router;



