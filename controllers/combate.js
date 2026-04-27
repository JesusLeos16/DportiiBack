const db = require("../config/db");

const getCombate = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM combate");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener combate", error);
    res.status(500).json({ error: "Error al obtener combate" });
  }
};

const getCombateById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [rows] = await db.query("SELECT * FROM combate WHERE idCombate = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Combate no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener combate", error);
    res.status(500).json({ error: "Error al obtener combate" });
  }
};

const createCombate = async (req, res) => {
  try {
    const { idTorneo, ronda, posicion_bracket, fecha_hora, idGanador } =
      req.body;
    if (!idTorneo || !ronda) {
      return res
        .status(400)
        .json({ error: "El idTorneo y la ronda son obligatorios" });
    }
    const ganadorFinal = idGanador ? idGanador : null;
    const [result] = await db.query(
      "INSERT INTO combate (idTorneo, idGanador, ronda, posicion_bracket, fecha_hora) VALUES (?, ?, ?, ?, ?)",
      [idTorneo, ganadorFinal, ronda, posicion_bracket, fecha_hora],
    );
    const [nuevoCombate] = await db.query(
      "SELECT * FROM combate WHERE idCombate = ?",
      [result.insertId],
    );
    res.status(201).json(nuevoCombate[0]);
  } catch (error) {
    console.error("Error al crear combate", error);
    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(400)
        .json({
          error: "El idTorneo o idGanador no existe en la base de datos",
        });
    }
    res.status(500).json({ error: "Error al crear combate" });
  }
};

const updateCombate = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { idTorneo, ronda, posicion_bracket, fecha_hora, idGanador } =
      req.body;
    if (!idTorneo || !ronda) {
      return res
        .status(400)
        .json({ error: "El idTorneo y la ronda son obligatorios" });
    }
    const [existing] = await db.query(
      "SELECT * FROM combate WHERE idCombate = ?",
      [id],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Combate no encontrado" });
    }
    await db.query(
      "UPDATE combate SET idTorneo = ?, ronda = ?, posicion_bracket = ?, fecha_hora = ?, idGanador = ? WHERE idCombate = ?",
      [idTorneo, ronda, posicion_bracket, fecha_hora, idGanador, id],
    );
    const [combateActualizado] = await db.query(
      "SELECT * FROM combate WHERE idCombate = ?",
      [id],
    );
    res.json({
      message: "Combate actualizado",
      combate: combateActualizado[0],
    });
  } catch (error) {
    console.error("Error al actualizar combate", error);
    res.status(500).json({ error: "Error al actualizar combate" });
  }
};

const deleteCombate = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [existing] = await db.query(
      "SELECT * FROM combate WHERE idCombate = ?",
      [id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        error: "Combate no encontrado",
      });
    }
    await db.query("DELETE FROM combate WHERE idCombate = ?", [id]);
    res.json({
      message: "Combate eliminado",
      combate: existing[0],
    });
  } catch (error) {
    console.error("Error al eliminar combate", error);
    res.status(500).json({ error: "Error al eliminar combate" });
  }
};

module.exports = {
  getCombate,
  getCombateById,
  createCombate,
  updateCombate,
  deleteCombate,
};
