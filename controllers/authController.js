// authController.js
const { Admin, AdminToken } = require('../models'); // ini akan ambil dari models/index.js
const { encrypt, generateToken } = require('../utils/encryption');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: 'Username dan password wajib diisi' });

  const admin = await Admin.findOne({ where: { username } });
  if (!admin) return res.status(401).json({ message: 'Admin tidak ditemukan' });

  const encryptedInput = encrypt(password);
  if (admin.password !== encryptedInput)
    return res.status(401).json({ message: 'Password salah' });

  const token = generateToken({ username: admin.username, time: Date.now() });
  await AdminToken.create({ token });

  res.json({ token });
};
