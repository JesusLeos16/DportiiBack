const db = require("../config/db");

const getTorneo = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const [rows] = await db.query("SELECT * FROM torneo WHERE idUsuario = ?", [idUsuario]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener torneos", error);
    res.status(500).json({ error: "Error al obtener torneos" });
  }
};

const getTorneoById = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const [rows] = await db.query("SELECT * FROM torneo WHERE idTorneo = ? AND idUsuario = ?", [
      id, idUsuario
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Torneo no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener torneo", error);
    res.status(500).json({ error: "Error al obtener torneo" });
  }
};

const createTorneo = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const { nombre, fecha, competidores } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre del torneo es obligatorio" });
    }
    

    const [result] = await db.query(
      "INSERT INTO torneo (nombre, fecha, competidores, idUsuario) VALUES (?, ?, ?, ?)",
      [nombre, fecha, competidores, idUsuario],
    );

    const [nuevoTorneo] = await db.query(
      "SELECT * FROM torneo WHERE idTorneo = ?",
      [result.insertId],
    );
    res.status(201).json(nuevoTorneo[0]);
  } catch (error) {
    console.error("Error al crear torneo", error);
    res.status(500).json({ error: "Error al crear torneo" });
  }
};

const updateTorneo = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const { nombre, fecha, competidores } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre del torneo es obligatorio" });
    }

    const [existing] = await db.query(
      "SELECT * FROM torneo WHERE idTorneo = ? AND idUsuario = ?",
      [id, idUsuario],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Torneo no encontrado" });
    }

    await db.query(
      "UPDATE torneo SET nombre = ?, fecha = ?, competidores = ? WHERE idTorneo = ? AND idUsuario = ?",
      [nombre, fecha, competidores, id, idUsuario],
    );

    const [torneoActualizado] = await db.query(
      "SELECT * FROM torneo WHERE idTorneo = ? AND idUsuario = ?",
      [id, idUsuario],
    );
    res.json({
      message: "Torneo actualizado",
      torneo: torneoActualizado[0],
    });
  } catch (error) {
    console.error("Error al actualizar torneo", error);
    res.status(500).json({ error: "Error al actualizar torneo" });
  }
};

const deleteTorneo = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const [existing] = await db.query(
      "SELECT * FROM torneo WHERE idTorneo = ? AND idUsuario = ?",
      [id, idUsuario],
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Torneo no encontrado" });
    }

    await db.query("DELETE FROM torneo WHERE idTorneo = ? AND idUsuario = ?", [id, idUsuario]);

    res.json({
      message: "Torneo eliminado",
      torneo: existing[0],
    });
  } catch (error) {
    console.error("Error al eliminar torneo", error);
    res.status(500).json({ error: "Error al eliminar torneo" });
  }
};

module.exports = {
  getTorneo,
  getTorneoById,
  createTorneo,
  updateTorneo,
  deleteTorneo,
};
