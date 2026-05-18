const db = require("../config/db");

const getMatchup = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const [rows] = await db.query("SELECT * FROM matchup WHERE idUsuario = ?", [idUsuario]);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener matchup", error);
    res.status(500).json({ error: "Error al obtener matchup" });
  }
};

const getMatchupById = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const [rows] = await db.query("SELECT * FROM matchup WHERE idMatchup = ? AND idUsuario = ?", [
      id, idUsuario
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
  
    const idUsuario = req.user.id;
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
      "INSERT INTO matchup (idPeleador, idCombate, esquina, idUsuario) VALUES (?, ?, ?, ?)",
      [idPeleador, idCombate, esquina, idUsuario],
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
    const idUsuario = req.user.id;
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
      "SELECT * FROM matchup WHERE idMatchup = ? AND idUsuario = ?",
      [id, idUsuario],
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Matchup no encontrado" });
    }
    await db.query(
      "UPDATE matchup SET idPeleador = ?, idCombate = ?, esquina = ? WHERE idMatchup = ? AND idUsuario = ?",
      [idPeleador, idCombate, esquina, id, idUsuario],
    );

    const [matchupActualizado] = await db.query(
      "SELECT * FROM matchup WHERE idMatchup = ? AND idUsuario = ?",
      [id, idUsuario],
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
    const idUsuario = req.user.id;
    const id = parseInt(req.params.id);
    const [existing] = await db.query(
      "SELECT * FROM matchup WHERE idMatchup = ? AND idUsuario = ?",
      [id, idUsuario],
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Matchup no encontrado" });
    }

    await db.query("DELETE FROM matchup WHERE idMatchup = ? AND idUsuario = ?", [id, idUsuario]);

    res.json({
      message: "Matchup eliminado",
      matchup: existing[0],
    });
  } catch (error) {
    console.error("Error al eliminar matchup", error);
    res.status(500).json({ error: "Error al eliminar matchup" });
  }
};

const generarMatchup = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const { idTorneo, categoria, nivel } = req.body;

    if (!idTorneo || !categoria || !nivel) {
      return res.status(400).json({ error: "idTorneo, categoria y nivel son obligatorios" });
    }

    const combinedCategory = `${nivel} - ${categoria}`;

    const [inscritos] = await db.query(
      "SELECT tp.idPeleador FROM torneo_peleador tp JOIN peleador p ON tp.idPeleador = p.idPeleador WHERE tp.idTorneo = ? AND tp.peso_registrado = ? AND p.nivel = ? AND tp.idUsuario = ?",
      [idTorneo, categoria, nivel, idUsuario]
    );

    if (inscritos.length < 2) {
      return res.status(400).json({ error: "Mínimo 2 peleadores necesarios en esta categoría" });
    }


    const peleadores = inscritos.map(i => i.idPeleador).sort(() => Math.random() - 0.5);

    await db.query(
      "DELETE FROM combate WHERE idTorneo = ? AND categoria = ? AND idUsuario = ?",
      [idTorneo, combinedCategory, idUsuario]
    );

    const combates = [];
    const fechaHora = new Date().toISOString().slice(0, 19).replace('T', ' ');

    for (let i = 0; i < peleadores.length; i += 2) {
      const p1 = peleadores[i];
      const p2 = peleadores[i + 1] || null;

      const [result] = await db.query(
        "INSERT INTO combate (idTorneo, categoria, ronda, posicion_bracket, fecha_hora, idUsuario) VALUES (?, ?, ?, ?, ?, ?)",
        [idTorneo, combinedCategory, 1, `R1-${Math.floor(i/2)+1}`, fechaHora, idUsuario]
      );
      
      const idCombate = result.insertId;
      combates.push(idCombate);

      await db.query(
        "INSERT INTO matchup (idPeleador, idCombate, esquina, idUsuario) VALUES (?, ?, ?, ?)",
        [p1, idCombate, 'roja', idUsuario]
      );

      if (p2) {
        await db.query(
          "INSERT INTO matchup (idPeleador, idCombate, esquina, idUsuario) VALUES (?, ?, ?, ?)",
          [p2, idCombate, 'azul', idUsuario]
        );
      } else {
        await db.query("UPDATE combate SET idGanador = ? WHERE idCombate = ?", [p1, idCombate]);
      }
    }

    res.status(201).json({ message: "Llaves generadas", combates });
  } catch (error) {
    console.error("Error al generar llaves:", error);
    res.status(500).json({ error: error.message });
  }
};

const swapMatchup = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const { idMatchup1, idMatchup2 } = req.body;

    const [m1] = await db.query("SELECT * FROM matchup WHERE idMatchup = ? AND idUsuario = ?", [idMatchup1, idUsuario]);
    const [m2] = await db.query("SELECT * FROM matchup WHERE idMatchup = ? AND idUsuario = ?", [idMatchup2, idUsuario]);

    if (m1.length === 0 || m2.length === 0) return res.status(404).json({error: "Matchup no encontrado"});

    await db.query("UPDATE matchup SET idPeleador = ? WHERE idMatchup = ?", [m2[0].idPeleador, idMatchup1]);
    await db.query("UPDATE matchup SET idPeleador = ? WHERE idMatchup = ?", [m1[0].idPeleador, idMatchup2]);

    res.json({ message: "Intercambio exitoso" });
  } catch (error) {
    console.error("Error al hacer swap:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const getBracket = async (req, res) => {
  try {
    const idUsuario = req.user.id;
    const { idTorneo, categoria, nivel } = req.params;

    const combinedCategory = `${nivel} - ${categoria}`;

    const query = `
      SELECT c.idCombate, c.ronda, c.posicion_bracket, c.idGanador,
             m.idMatchup, m.esquina,
             p.idPeleador, p.nombre, p.apodo,
             a.nombre AS academia
      FROM combate c
      LEFT JOIN matchup m ON c.idCombate = m.idCombate
      LEFT JOIN peleador p ON m.idPeleador = p.idPeleador
      LEFT JOIN academia a ON p.idAcademia = a.idAcademia
      WHERE c.idTorneo = ? AND c.categoria = ? AND c.idUsuario = ?
      ORDER BY c.ronda ASC, c.posicion_bracket ASC
    `;
    const [rows] = await db.query(query, [idTorneo, combinedCategory, idUsuario]);
    
    const combatesMap = {};
    rows.forEach(row => {
      if (!combatesMap[row.idCombate]) {
        combatesMap[row.idCombate] = {
          idCombate: row.idCombate,
          ronda: row.ronda,
          posicion_bracket: row.posicion_bracket,
          idGanador: row.idGanador,
          esquinaRoja: null,
          esquinaAzul: null
        };
      }
      
      if (row.esquina) {
        const fighterData = {
          idMatchup: row.idMatchup,
          idPeleador: row.idPeleador,
          nombre: row.nombre,
          apodo: row.apodo,
          academia: row.academia
        };
        if (row.esquina === 'roja') combatesMap[row.idCombate].esquinaRoja = fighterData;
        if (row.esquina === 'azul') combatesMap[row.idCombate].esquinaAzul = fighterData;
      }
    });

    res.json(Object.values(combatesMap));
  } catch (error) {
    console.error("Error al obtener bracket:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = {
  getMatchup,
  getMatchupById,
  createMatchup,
  updateMatchup,
  deleteMatchup,
  generarMatchup,
  swapMatchup,
  getBracket
};
