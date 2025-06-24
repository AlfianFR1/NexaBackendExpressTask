const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');
const {
  createKaryawan,
  listKaryawan,
  updateKaryawan,
  deactivateKaryawan,
} = require('../controllers/karyawanController');

// Semua endpoint butuh token (authMiddleware)
router.post('/create', authMiddleware, createKaryawan);
router.get('/list', authMiddleware, listKaryawan);
router.put('/update/:nip', authMiddleware, updateKaryawan);
router.delete('/deactivate/:nip', authMiddleware, deactivateKaryawan);

module.exports = router;
