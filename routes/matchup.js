const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getMatchup,
    getMatchupById,
    createMatchup,
    updateMatchup,
    deleteMatchup,
    generarMatchup,
    swapMatchup,
    getBracket
} = require('../controllers/matchup');

router.get('/', authMiddleware, getMatchup);
router.get('/bracket/:idTorneo/:categoria/:nivel', authMiddleware, getBracket);
router.get('/:id', authMiddleware, getMatchupById);
router.post('/generar', authMiddleware, generarMatchup);
router.post('/', authMiddleware, createMatchup);
router.put('/swap', authMiddleware, swapMatchup);
router.put('/:id', authMiddleware, updateMatchup);
router.delete('/:id', authMiddleware, deleteMatchup);

module.exports = router;