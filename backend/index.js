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

app.listen(port, () => {
  console.log(`La aplicación está funcionando en el puerto ${port}`);
});