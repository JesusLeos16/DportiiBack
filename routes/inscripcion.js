const express = require("express");
const router = express.Router();
const {
  getInscritos,
  inscribirPeleador,
  eliminarInscripcion
} = require("../controllers/inscripcion");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/torneo/:idTorneo", authMiddleware, getInscritos);
router.post("/", authMiddleware, inscribirPeleador);
router.delete("/:id", authMiddleware, eliminarInscripcion);

module.exports = router;
