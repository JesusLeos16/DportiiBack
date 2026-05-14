const db = require("../config/db");

const getInscritos = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const idTorneo = parseInt(req.params.idTorneo);
    
    if (!idTorneo) {
      return res.status(400).json({ error: "Falta idTorneo" });
    }

    const query = `
      SELECT tp.id AS idInscripcion, tp.peso_registrado,
             p.idPeleador, p.nombre, p.apodo, p.peso AS peso_base, p.nivel,
             a.nombre AS academia
      FROM torneo_peleador tp
      JOIN peleador p ON tp.idPeleador = p.idPeleador
      JOIN academia a ON p.idAcademia = a.idAcademia
      WHERE tp.idTorneo = ? AND tp.idUsuario = ?
    `;
    
    const [rows] = await db.query(query, [idTorneo, idUsuario]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener inscritos:", error);
    res.status(500).json({ error: "Error al obtener inscritos" });
  }
};

const inscribirPeleador = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const { idTorneo, idPeleador, peso_registrado } = req.body;

    if (!idTorneo || !idPeleador) {
      return res.status(400).json({ error: "Faltan datos obligatorios (idTorneo, idPeleador)" });
    }

    const [existing] = await db.query(
      "SELECT * FROM torneo_peleador WHERE idTorneo = ? AND idPeleador = ? AND idUsuario = ?",
      [idTorneo, idPeleador, idUsuario]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "El peleador ya está inscrito en este torneo" });
    }

    const [result] = await db.query(
      "INSERT INTO torneo_peleador (idTorneo, idPeleador, peso_registrado, idUsuario) VALUES (?, ?, ?, ?)",
      [idTorneo, idPeleador, peso_registrado || null, idUsuario]
    );

    res.status(201).json({
      message: "Peleador inscrito correctamente",
      idInscripcion: result.insertId
    });
  } catch (error) {
    console.error("Error al inscribir peleador:", error);
    res.status(500).json({ error: "Error al inscribir peleador" });
  }
};

const eliminarInscripcion = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);

    const [existing] = await db.query(
      "SELECT * FROM torneo_peleador WHERE id = ? AND idUsuario = ?",
      [id, idUsuario]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Inscripción no encontrada" });
    }

    await db.query("DELETE FROM torneo_peleador WHERE id = ? AND idUsuario = ?", [id, idUsuario]);

    res.json({ message: "Inscripción eliminada" });
  } catch (error) {
    console.error("Error al eliminar inscripción:", error);
    res.status(500).json({ error: "Error al eliminar inscripción" });
  }
};

module.exports = {
  getInscritos,
  inscribirPeleador,
  eliminarInscripcion
};
