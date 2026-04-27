const db = require("../config/db");

const getMatchup = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM matchup");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener matchup", error);
    res.status(500).json({ error: "Error al obtener matchup" });
  }
};

const getMatchupById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await db.query("SELECT * FROM matchup WHERE idMatchup = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Matchup no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener matchup", error);
    res.status(500).json({ error: "Error al obtener matchup" });
  }
};

const createMatchup = async (req, res) => {
  try {
    const { idPeleador, idCombate, esquina } = req.body;

    if (!esquina || !idCombate || !idPeleador) {
      return res
        .status(400)
        .json({ error: "El idPeleador, idCombate y esquina son obligatorios" });
    }
    if (esquina !== undefined && esquina !== "roja" && esquina !== "azul") {
      return res
        .status(400)
        .json({ error: "La esquina debe ser 'roja' o 'azul'" });
    }
    const [result] = await db.query(
      "INSERT INTO matchup (idPeleador, idCombate, esquina) VALUES (?, ?, ?)",
      [idPeleador, idCombate, esquina],
    );

    const [nuevoMatchup] = await db.query(
      "SELECT * FROM matchup WHERE idMatchup = ?",
      [result.insertId],
    );
    res.status(201).json(nuevoMatchup[0]);
  } catch (error) {
    console.error("Error al crear matchup", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        error: "El idPeleador o idCombate no existe en la base de datos",
      });
    }
    res.status(500).json({ error: "Error al crear matchup" });
  }
};

const updateMatchup = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { idPeleador, idCombate, esquina } = req.body;

    if (!esquina || !idCombate || !idPeleador) {
      return res
        .status(400)
        .json({ error: "El idPeleador, idCombate y esquina son obligatorios" });
    }
    if (esquina !== undefined && esquina !== "roja" && esquina !== "azul") {
      return res
        .status(400)
        .json({ error: "La esquina debe ser 'roja' o 'azul'" });
    }

    const [existing] = await db.query(
      "SELECT * FROM matchup WHERE idMatchup = ?",
      [id],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Matchup no encontrado" });
    }
    await db.query(
      "UPDATE matchup SET idPeleador = ?, idCombate = ?, esquina = ? WHERE idMatchup = ?",
      [idPeleador, idCombate, esquina, id],
    );

    const [matchupActualizado] = await db.query(
      "SELECT * FROM matchup WHERE idMatchup = ?",
      [id],
    );
    res.json({
      message: "Matchup actualizado",
      matchup: matchupActualizado[0],
    });
  } catch (error) {
    console.error("Error al actualizar matchup", error);
    res.status(500).json({ error: "Error al actualizar matchup" });
  }
};

const deleteMatchup = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.query(
      "SELECT * FROM matchup WHERE idMatchup = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Matchup no encontrado" });
    }

    await db.query("DELETE FROM matchup WHERE idMatchup = ?", [id]);

    res.json({
      message: "Matchup eliminado",
      matchup: existing[0],
    });
  } catch (error) {
    console.error("Error al eliminar matchup", error);
    res.status(500).json({ error: "Error al eliminar matchup" });
  }
};

module.exports = {
  getMatchup,
  getMatchupById,
  createMatchup,
  updateMatchup,
  deleteMatchup,
};
