const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
    getCombate,
    getCombateById,
    createCombate,
    updateCombate,
    deleteCombate
} = require('../controllers/combate');

router.get('/', authMiddleware, getCombate);
router.get('/:id', authMiddleware, getCombateById);
router.post('/', authMiddleware, createCombate);
router.put('/:id', authMiddleware, updateCombate);
router.delete('/:id', authMiddleware, deleteCombate);

module.exports = router;