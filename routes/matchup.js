const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getMatchup,
    getMatchupById,
    createMatchup,
    updateMatchup,
    deleteMatchup
} = require('../controllers/matchup');

router.get('/', authMiddleware, getMatchup);
router.get('/:id', authMiddleware, getMatchupById);
router.post('/', authMiddleware, createMatchup);
router.put('/:id', authMiddleware, updateMatchup);
router.delete('/:id', authMiddleware, deleteMatchup);

module.exports = router;