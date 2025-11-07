import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Listar todos los conductores
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM conductores ORDER BY id");
  res.json({
    success: true,
    conductores: rows,
  });
});

// Obtener un conductor por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM conductores WHERE id=?", [
      id,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    res.json({ success: true, conductor: rows[0] });
  }
);

// Crear un conductor
router.post(
  "/",
  verificarAutenticacion,
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido", "Apellido inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("dni", "DNI inválido").isLength({ min: 1, max: 20 }),
  body("licencia", "Licencia inválida").isLength({ min: 1, max: 20 }),
  body("fecha_vencimiento_licencia", "Fecha de vencimiento inválida")
    .isISO8601()
    .toDate(),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, apellido, dni, licencia, fecha_vencimiento_licencia } =
      req.body;

    // Verificar si el DNI ya existe
    const [existe] = await db.execute(
      "SELECT id FROM conductores WHERE dni=?",
      [dni]
    );

    if (existe.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El DNI ya está registrado" });
    }

    const [result] = await db.execute(
      "INSERT INTO conductores (nombre, apellido, dni, licencia, fecha_vencimiento_licencia) VALUES (?,?,?,?,?)",
      [nombre, apellido, dni, licencia, fecha_vencimiento_licencia]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        nombre,
        apellido,
        dni,
        licencia,
        fecha_vencimiento_licencia,
      },
    });
  }
);

// Modificar un conductor
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("nombre", "Nombre inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("apellido", "Apellido inválido").isAlpha("es-ES").isLength({ max: 50 }),
  body("dni", "DNI inválido").isLength({ min: 1, max: 20 }),
  body("licencia", "Licencia inválida").isLength({ min: 1, max: 20 }),
  body("fecha_vencimiento_licencia", "Fecha de vencimiento inválida")
    .isISO8601()
    .toDate(),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, apellido, dni, licencia, fecha_vencimiento_licencia } =
      req.body;

    // Verificar que el conductor exista
    const [existe] = await db.execute(
      "SELECT id FROM conductores WHERE id=?",
      [id]
    );

    if (existe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    // Verificar si el DNI ya existe en otro conductor
    const [dniExiste] = await db.execute(
      "SELECT id FROM conductores WHERE dni=? AND id!=?",
      [dni, id]
    );

    if (dniExiste.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "El DNI ya está registrado" });
    }

    await db.execute(
      "UPDATE conductores SET nombre=?, apellido=?, dni=?, licencia=?, fecha_vencimiento_licencia=? WHERE id=?",
      [nombre, apellido, dni, licencia, fecha_vencimiento_licencia, id]
    );

    res.json({
      success: true,
      data: {
        id,
        nombre,
        apellido,
        dni,
        licencia,
        fecha_vencimiento_licencia,
      },
    });
  }
);

// Eliminar un conductor
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el conductor exista
    const [existe] = await db.execute(
      "SELECT id FROM conductores WHERE id=?",
      [id]
    );

    if (existe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    await db.execute("DELETE FROM conductores WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;



