const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const algorithm = 'aes-256-cbc';
const secretKey = crypto.createHash('sha256').update(process.env.AES_KEY).digest(); // 32 bytes
const iv = Buffer.alloc(16, 0); // IV tetap (untuk penyederhanaan)

function encrypt(text) {
  if (typeof text !== 'string') throw new Error('Data untuk dienkripsi harus berupa string');

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  encrypt,
  decrypt,
  generateToken,
  verifyToken
};
