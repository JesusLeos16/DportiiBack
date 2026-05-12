const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getPeleador,
    getPeleadorById,
    createPeleador,
    updatePeleador,
    deletePeleador
} = require('../controllers/peleador');

router.get('/', authMiddleware, getPeleador);
router.get('/:id', authMiddleware, getPeleadorById);
router.post('/', authMiddleware, createPeleador);
router.put('/:id', authMiddleware, updatePeleador);
router.delete('/:id', authMiddleware, deletePeleador);

module.exports = router;