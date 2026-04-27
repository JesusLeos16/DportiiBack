const express = require('express');
const router = express.Router();
const {
    getMatchup,
    getMatchupById,
    createMatchup,
    updateMatchup,
    deleteMatchup
} = require('../controllers/matchup');

router.get('/', getMatchup);
router.get('/:id', getMatchupById);
router.post('/', createMatchup);
router.put('/:id', updateMatchup);
router.delete('/:id', deleteMatchup);

module.exports = router;