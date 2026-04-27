const express = require('express');
const router = express.Router();
const {
    getCombate,
    getCombateById,
    createCombate,
    updateCombate,
    deleteCombate
} = require('../controllers/combate');

router.get('/', getCombate);
router.get('/:id', getCombateById);
router.post('/', createCombate);
router.put('/:id', updateCombate);
router.delete('/:id', deleteCombate);

module.exports = router;