const express = require('express');
const router = express.Router();
const {
    getAcademia,
    getAcademiaById,
    createAcademia,
    updateAcademia,
    deleteAcademia
} = require('../controllers/academia');

router.get('/', getAcademia);
router.get('/:id', getAcademiaById);
router.post('/', createAcademia);
router.put('/:id', updateAcademia);
router.delete('/:id', deleteAcademia);

module.exports = router;