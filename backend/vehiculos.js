import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Listar todos los vehículos
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM vehiculos ORDER BY id");
  res.json({
    success: true,
    vehiculos: rows,
  });
});

// Obtener un vehículo por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM vehiculos WHERE id=?", [
      id,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    res.json({ success: true, vehiculo: rows[0] });
  }
);

// Crear un vehículo
router.post(
  "/",
  verificarAutenticacion,
  body("marca", "Marca inválida").isAlpha("es-ES").isLength({ max: 50 }),
  body("modelo", "Modelo inválido").isLength({ max: 50 }),
  body("patente", "Patente inválida").isLength({ min: 1, max: 10 }),
  body("año", "Año inválido").isInt({ min: 1900, max: 2100 }),
  body("capacidad_carga", "Capacidad de carga inválida")
    .isFloat({ min: 0 })
    .toFloat(),
  verificarValidaciones,
  async (req, res) => {
    const { marca, modelo, patente, año, capacidad_carga } = req.body;

    // Verificar si la patente ya existe
    const [existe] = await db.execute(
      "SELECT id FROM vehiculos WHERE patente=?",
      [patente]
    );

    if (existe.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "La patente ya está registrada" });
    }

    const [result] = await db.execute(
      "INSERT INTO vehiculos (marca, modelo, patente, año, capacidad_carga) VALUES (?,?,?,?,?)",
      [marca, modelo, patente, año, capacidad_carga]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        marca,
        modelo,
        patente,
        año,
        capacidad_carga,
      },
    });
  }
);

// Modificar un vehículo
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("marca", "Marca inválida").isAlpha("es-ES").isLength({ max: 50 }),
  body("modelo", "Modelo inválido").isLength({ max: 50 }),
  body("patente", "Patente inválida").isLength({ min: 1, max: 10 }),
  body("año", "Año inválido").isInt({ min: 1900, max: 2100 }),
  body("capacidad_carga", "Capacidad de carga inválida")
    .isFloat({ min: 0 })
    .toFloat(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { marca, modelo, patente, año, capacidad_carga } = req.body;

    // Verificar que el vehículo exista
    const [existe] = await db.execute(
      "SELECT id FROM vehiculos WHERE id=?",
      [id]
    );

    if (existe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    // Verificar si la patente ya existe en otro vehículo
    const [patenteExiste] = await db.execute(
      "SELECT id FROM vehiculos WHERE patente=? AND id!=?",
      [patente, id]
    );

    if (patenteExiste.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "La patente ya está registrada" });
    }

    await db.execute(
      "UPDATE vehiculos SET marca=?, modelo=?, patente=?, año=?, capacidad_carga=? WHERE id=?",
      [marca, modelo, patente, año, capacidad_carga, id]
    );

    res.json({
      success: true,
      data: { id, marca, modelo, patente, año, capacidad_carga },
    });
  }
);

// Eliminar un vehículo
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el vehículo exista
    const [existe] = await db.execute(
      "SELECT id FROM vehiculos WHERE id=?",
      [id]
    );

    if (existe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    await db.execute("DELETE FROM vehiculos WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;