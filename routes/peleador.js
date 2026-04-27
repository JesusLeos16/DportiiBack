const express = require('express');
const router = express.Router();
const {
    getPeleador,
    getPeleadorById,
    createPeleador,
    updatePeleador,
    deletePeleador
} = require('../controllers/peleador');

router.get('/', getPeleador);
router.get('/:id', getPeleadorById);
router.post('/', createPeleador);
router.put('/:id', updatePeleador);
router.delete('/:id', deletePeleador);

module.exports = router;