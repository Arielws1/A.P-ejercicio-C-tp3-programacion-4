import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import vehiculosRouter from "./vehiculos.js";
import conductoresRouter from "./conductores.js";
import viajesRouter from "./viajes.js";
import authRouter, { authConfig } from "./auth.js";

conectarDB();

const app = express();
const port = 3000;

// Para interpretar body como JSON
app.use(express.json());

// Habilito CORS
app.use(cors());

authConfig();

app.get("/", (req, res) => {
  res.send("API de Gestión de Transporte - Vehículos, Conductores y Viajes");
});

app.use("/auth", authRouter);
app.use("/vehiculos", vehiculosRouter);
app.use("/conductores", conductoresRouter);
app.use("/viajes", viajesRouter);

// Middleware para manejar errores de autenticación
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: "Token inválido o expirado. Por favor, inicie sesión nuevamente.",
    });
  }
  // Manejo de errores del servidor (500)
  console.error("Error del servidor:", err);
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
  });
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en el puerto ${port}`);
});