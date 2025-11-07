import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones } from "./validaciones.js";
import { body, param } from "express-validator";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

// Listar todos los viajes
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute(
    `SELECT v.*, 
            ve.marca, ve.modelo, ve.patente,
            c.nombre as conductor_nombre, c.apellido as conductor_apellido, c.dni
     FROM viajes v
     JOIN vehiculos ve ON v.vehiculo_id = ve.id
     JOIN conductores c ON v.conductor_id = c.id
     ORDER BY v.fecha_salida DESC`
  );
  res.json({
    success: true,
    viajes: rows,
  });
});

// Obtener un viaje por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute(
      `SELECT v.*, 
              ve.marca, ve.modelo, ve.patente,
              c.nombre as conductor_nombre, c.apellido as conductor_apellido, c.dni
       FROM viajes v
       JOIN vehiculos ve ON v.vehiculo_id = ve.id
       JOIN conductores c ON v.conductor_id = c.id
       WHERE v.id=?`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Viaje no encontrado" });
    }

    res.json({ success: true, viaje: rows[0] });
  }
);

// Crear un viaje
router.post(
  "/",
  verificarAutenticacion,
  body("vehiculo_id", "ID de vehículo inválido").isInt({ min: 1 }),
  body("conductor_id", "ID de conductor inválido").isInt({ min: 1 }),
  body("fecha_salida", "Fecha de salida inválida").isISO8601().toDate(),
  body("fecha_llegada", "Fecha de llegada inválida").isISO8601().toDate(),
  body("origen", "Origen inválido").isLength({ min: 1, max: 100 }),
  body("destino", "Destino inválido").isLength({ min: 1, max: 100 }),
  body("kilometros", "Kilómetros inválidos").isFloat({ min: 0 }).toFloat(),
  body("observaciones").optional().isLength({ max: 1000 }),
  verificarValidaciones,
  async (req, res) => {
    const {
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      observaciones,
    } = req.body;

    // Verificar que el vehículo existe
    const [vehiculo] = await db.execute(
      "SELECT id FROM vehiculos WHERE id=?",
      [vehiculo_id]
    );

    if (vehiculo.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    // Verificar que el conductor existe
    const [conductor] = await db.execute(
      "SELECT id FROM conductores WHERE id=?",
      [conductor_id]
    );

    if (conductor.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    // Verificar que la fecha de llegada sea posterior a la de salida
    const fechaSalida = new Date(fecha_salida);
    const fechaLlegada = new Date(fecha_llegada);

    if (fechaLlegada <= fechaSalida) {
      return res.status(400).json({
        success: false,
        error: "La fecha de llegada debe ser posterior a la fecha de salida",
      });
    }

    const [result] = await db.execute(
      "INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES (?,?,?,?,?,?,?,?)",
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones || null,
      ]
    );

    res.status(201).json({
      success: true,
      data: {
        id: result.insertId,
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones,
      },
    });
  }
);

// Modificar un viaje
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  body("vehiculo_id", "ID de vehículo inválido").isInt({ min: 1 }),
  body("conductor_id", "ID de conductor inválido").isInt({ min: 1 }),
  body("fecha_salida", "Fecha de salida inválida").isISO8601().toDate(),
  body("fecha_llegada", "Fecha de llegada inválida").isISO8601().toDate(),
  body("origen", "Origen inválido").isLength({ min: 1, max: 100 }),
  body("destino", "Destino inválido").isLength({ min: 1, max: 100 }),
  body("kilometros", "Kilómetros inválidos").isFloat({ min: 0 }).toFloat(),
  body("observaciones").optional().isLength({ max: 1000 }),
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const {
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      observaciones,
    } = req.body;

    // Verificar que el viaje existe
    const [existe] = await db.execute("SELECT id FROM viajes WHERE id=?", [id]);

    if (existe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Viaje no encontrado" });
    }

    // Verificar que el vehículo existe
    const [vehiculo] = await db.execute(
      "SELECT id FROM vehiculos WHERE id=?",
      [vehiculo_id]
    );

    if (vehiculo.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    // Verificar que el conductor existe
    const [conductor] = await db.execute(
      "SELECT id FROM conductores WHERE id=?",
      [conductor_id]
    );

    if (conductor.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    // Verificar que la fecha de llegada sea posterior a la de salida
    const fechaSalida = new Date(fecha_salida);
    const fechaLlegada = new Date(fecha_llegada);

    if (fechaLlegada <= fechaSalida) {
      return res.status(400).json({
        success: false,
        error: "La fecha de llegada debe ser posterior a la fecha de salida",
      });
    }

    await db.execute(
      "UPDATE viajes SET vehiculo_id=?, conductor_id=?, fecha_salida=?, fecha_llegada=?, origen=?, destino=?, kilometros=?, observaciones=? WHERE id=?",
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones || null,
        id,
      ]
    );

    res.json({
      success: true,
      data: {
        id,
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones,
      },
    });
  }
);

// Eliminar un viaje
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el viaje existe
    const [existe] = await db.execute("SELECT id FROM viajes WHERE id=?", [id]);

    if (existe.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Viaje no encontrado" });
    }

    await db.execute("DELETE FROM viajes WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

// Consultar historial de viajes por vehículo
router.get(
  "/vehiculo/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el vehículo existe
    const [vehiculo] = await db.execute(
      "SELECT id, marca, modelo, patente FROM vehiculos WHERE id=?",
      [id]
    );

    if (vehiculo.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    const [viajes] = await db.execute(
      `SELECT v.*, 
              c.nombre as conductor_nombre, c.apellido as conductor_apellido, c.dni
       FROM viajes v
       JOIN conductores c ON v.conductor_id = c.id
       WHERE v.vehiculo_id=?
       ORDER BY v.fecha_salida DESC`,
      [id]
    );

    res.json({
      success: true,
      vehiculo: vehiculo[0],
      viajes,
    });
  }
);

// Consultar historial de viajes por conductor
router.get(
  "/conductor/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el conductor existe
    const [conductor] = await db.execute(
      "SELECT id, nombre, apellido, dni FROM conductores WHERE id=?",
      [id]
    );

    if (conductor.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    const [viajes] = await db.execute(
      `SELECT v.*, 
              ve.marca, ve.modelo, ve.patente
       FROM viajes v
       JOIN vehiculos ve ON v.vehiculo_id = ve.id
       WHERE v.conductor_id=?
       ORDER BY v.fecha_salida DESC`,
      [id]
    );

    res.json({
      success: true,
      conductor: conductor[0],
      viajes,
    });
  }
);

// Calcular total de kilómetros por vehículo
router.get(
  "/vehiculo/:id/kilometros",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el vehículo existe
    const [vehiculo] = await db.execute(
      "SELECT id, marca, modelo, patente FROM vehiculos WHERE id=?",
      [id]
    );

    if (vehiculo.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehículo no encontrado" });
    }

    const [result] = await db.execute(
      "SELECT COALESCE(SUM(kilometros), 0) as total_kilometros FROM viajes WHERE vehiculo_id=?",
      [id]
    );

    res.json({
      success: true,
      vehiculo: vehiculo[0],
      total_kilometros: parseFloat(result[0].total_kilometros),
    });
  }
);

// Calcular total de kilómetros por conductor
router.get(
  "/conductor/:id/kilometros",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    // Verificar que el conductor existe
    const [conductor] = await db.execute(
      "SELECT id, nombre, apellido, dni FROM conductores WHERE id=?",
      [id]
    );

    if (conductor.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Conductor no encontrado" });
    }

    const [result] = await db.execute(
      "SELECT COALESCE(SUM(kilometros), 0) as total_kilometros FROM viajes WHERE conductor_id=?",
      [id]
    );

    res.json({
      success: true,
      conductor: conductor[0],
      total_kilometros: parseFloat(result[0].total_kilometros),
    });
  }
);

export default router;