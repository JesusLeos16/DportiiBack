const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users');

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;