const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getTorneo,
    getTorneoById,
    createTorneo,
    updateTorneo,
    deleteTorneo
} = require('../controllers/torneo');

router.get('/', authMiddleware, getTorneo);
router.get('/:id', authMiddleware, getTorneoById);
router.post('/', authMiddleware, createTorneo);
router.put('/:id', authMiddleware, updateTorneo);
router.delete('/:id', authMiddleware, deleteTorneo);

module.exports = router;