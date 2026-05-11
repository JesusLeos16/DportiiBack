const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
    getAcademia,
    getAcademiaById,
    createAcademia,
    updateAcademia,
    deleteAcademia
} = require('../controllers/academia');

router.get('/', authMiddleware, getAcademia);
router.get('/:id', authMiddleware, getAcademiaById);
router.post('/', authMiddleware, createAcademia);
router.put('/:id', authMiddleware, updateAcademia);
router.delete('/:id', authMiddleware, deleteAcademia);

module.exports = router;