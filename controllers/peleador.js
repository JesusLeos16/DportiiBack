const db = require("../config/db");

const getPeleador = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const [rows] = await db.query("SELECT * FROM peleador WHERE idUsuario = ?", [idUsuario]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener peleadores", error);
    res.status(500).json({ error: "Error al obtener peleadores" });
  }
};

const getPeleadorById = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const [rows] = await db.query(
      "SELECT * FROM peleador WHERE idPeleador = ? AND idUsuario = ?",
      [id, idUsuario],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Peleador no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener peleador", error);
    res.status(500).json({ error: "Error al obtener peleador" });
  }
};

const createPeleador = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const { nombre, apodo, peso, edad, nivel, telefono, idAcademia } = req.body;

    if (!nombre || !idAcademia) {
      return res
        .status(400)
        .json({ error: "El nombre y la academia son obligatorios" });
    }

    const [result] = await db.query(
      "INSERT INTO peleador (nombre, apodo, peso, edad, nivel, telefono, idAcademia, idUsuario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [nombre, apodo, peso, edad || 0, nivel, telefono, idAcademia, idUsuario],
    );

    const [nuevoPeleador] = await db.query(
      "SELECT * FROM peleador WHERE idPeleador = ?",
      [result.insertId],
    );
    res.status(201).json(nuevoPeleador[0]);
  } catch (error) {
    console.error("Error al crear peleador", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ error: "La academia indicada (idAcademia) no existe" });
    }
    res.status(500).json({ error: "Error al crear peleador" });
  }
};

const updatePeleador = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const { nombre, apodo, peso, edad, nivel, telefono, idAcademia } = req.body;

    if (!nombre || !idAcademia) {
      return res
        .status(400)
        .json({ error: "El nombre y la academia son obligatorios" });
    }

    const [existing] = await db.query(
      "SELECT * FROM peleador WHERE idPeleador = ? AND idUsuario = ?",
      [id, idUsuario],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Peleador no encontrado" });
    }

    await db.query(
      "UPDATE peleador SET nombre = ?, apodo = ?, peso = ?, edad = ?, nivel = ?, telefono = ?, idAcademia = ? WHERE idPeleador = ? AND idUsuario = ?",
      [nombre, apodo, peso, edad || 0, nivel, telefono, idAcademia, id, idUsuario],
    );

    const [peleadorActualizado] = await db.query(
      "SELECT * FROM peleador WHERE idPeleador = ? AND idUsuario = ?",
      [id, idUsuario],
    );
    res.json({
      message: "Peleador actualizado",
      peleador: peleadorActualizado[0],
    });
  } catch (error) {
    console.error("Error al actualizar peleador", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({ error: "La academia indicada (idAcademia) no existe" });
    }
    res.status(500).json({ error: "Error al actualizar peleador" });
  }
};

const deletePeleador = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const [existing] = await db.query(
      "SELECT * FROM peleador WHERE idPeleador = ? AND idUsuario = ?",
      [id, idUsuario],
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Peleador no encontrado" });
    }

    await db.query("DELETE FROM peleador WHERE idPeleador = ? AND idUsuario = ?", [id, idUsuario]);

    res.json({
      message: "Peleador eliminado",
      peleador: existing[0],
    });
  } catch (error) {
    console.error("Error al eliminar peleador", error);
    res.status(500).json({ error: "Error al eliminar peleador" });
  }
};

module.exports = {
  getPeleador,
  getPeleadorById,
  createPeleador,
  updatePeleador,
  deletePeleador,
};
