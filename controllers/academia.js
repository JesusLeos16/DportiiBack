const db = require("../config/db");

const getAcademia = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM academia");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener academia", error);
    res.status(500).json({ error: "Error al obtener academia" });
  }
};

const getAcademiaById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await db.query(
      "SELECT * FROM academia WHERE idAcademia = ?",
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Academia no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener academia", error);
    res.status(500).json({ error: "Error al obtener academia" });
  }
};

const createAcademia = async (req, res) => {
  try {
    const { nombre, entrenador, direccion, telefono } = req.body;
    if (!nombre || !entrenador || !direccion || !telefono) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const [result] = await db.query(
      "INSERT INTO academia (nombre, entrenador, direccion, telefono) VALUES (?, ?, ?, ?)",
      [nombre, entrenador, direccion, telefono],
    );
    const [newAcademia] = await db.query(
      "SELECT * FROM academia WHERE idAcademia = ?",
      [result.insertId],
    );
    res.status(201).json(newAcademia[0]);
  } catch (error) {
    console.error("Error al crear academia", error);
    res.status(500).json({ error: "Error al crear academia" });
  }
};

const updateAcademia = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { nombre, entrenador, direccion, telefono } = req.body;
    if (!nombre || !entrenador || !direccion || !telefono) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const [existing] = await db.query(
      "SELECT * FROM academia WHERE idAcademia = ?",
      [id],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Academia no encontrada" });
    }
    await db.query(
      "UPDATE academia SET nombre = ?, entrenador = ?, direccion = ?, telefono = ? WHERE idAcademia = ?",
      [nombre, entrenador, direccion, telefono, id],
    );
    const [academiaActualizada] = await db.query(
      "SELECT * FROM academia WHERE idAcademia = ?",
      [id],
    );
    res.json({
      message: "Academia actualizada",
      academia: academiaActualizada[0],
    });
  } catch (error) {
    console.error("Error al actualizar academia", error);
    res.status(500).json({ error: "Error al actualizar academia" });
  }
};

const deleteAcademia = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.query(
      "SELECT * FROM academia WHERE idAcademia = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Academia no encontrada",
      });
    }
    await db.query("DELETE FROM academia WHERE idAcademia = ?", [id]);
    res.json({
      message: "Academia eliminada",
      academia: existing[0],
    });
  } catch (error) {
    console.error("Error al eliminar academia", error);
    res.status(500).json({ error: "Error al eliminar academia" });
  }
};

module.exports = {
  getAcademia,
  getAcademiaById,
  createAcademia,
  updateAcademia,
  deleteAcademia,
};
