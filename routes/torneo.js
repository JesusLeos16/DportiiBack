const express = require('express');
const router = express.Router();
const {
    getTorneo,
    getTorneoById,
    createTorneo,
    updateTorneo,
    deleteTorneo
} = require('../controllers/torneo');

router.get('/', getTorneo);
router.get('/:id', getTorneoById);
router.post('/', createTorneo);
router.put('/:id', updateTorneo);
router.delete('/:id', deleteTorneo);

module.exports = router;