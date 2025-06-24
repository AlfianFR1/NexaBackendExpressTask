const {Karyawan} = require('../models/');
const { Op } = require('sequelize');

// Helper untuk validasi base64
function isBase64(str) {
  const base64Regex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=)?$/i;
  return base64Regex.test(str);
}

// 🔢 Helper untuk generate NIP unik
async function generateNip() {
  const year = new Date().getFullYear();
  const like = `${year}%`;
  const last = await Karyawan.findOne({
    where: { nip: { [Op.like]: like } },
    order: [['nip', 'DESC']]
  });

  let counter = 1;
  if (last) {
    const lastCounter = parseInt(last.nip.slice(4));
    counter = lastCounter + 1;
  }

  return `${year}${String(counter).padStart(4, '0')}`;
}

// ✅ [POST] /karyawan/create
exports.createKaryawan = async (req, res) => {
  try {
    const { nama, photo, status = 1 } = req.body;

    if (typeof nama !== 'string' || nama.trim() === '') {
      return res.status(400).json({ message: 'Nama wajib diisi dan harus berupa teks' });
    }

    const invalidChars = /[^a-zA-Z0-9\s.,'-]/;
    if (invalidChars.test(nama)) {
      return res.status(400).json({ message: 'Nama mengandung karakter tidak valid' });
    }



    if (!nama || !photo) {
      return res.status(400).json({ message: 'Nama dan photo wajib diisi' });
    }

    if (!isBase64(photo)) {
      return res.status(400).json({ message: 'Format photo harus base64 valid' });
    }

    const nip = await generateNip();

    const newKaryawan = await Karyawan.create({ nip, nama, photo, status });
    res.status(201).json({ message: 'Karyawan berhasil ditambahkan', data: newKaryawan });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan karyawan', error: err.message });
  }
};

// ✅ [GET] /karyawan/list?keyword=&start=0&count=10
exports.listKaryawan = async (req, res) => {
  try {
    const { keyword = '', start = 0, count = 10 } = req.query;

    if (isNaN(start) || isNaN(count)) {
      return res.status(400).json({ message: 'Parameter start dan count harus berupa angka' });
    }

    // Cek karakter berbahaya di keyword
    const invalidChars = /[^a-zA-Z0-9\s]/;
    if (invalidChars.test(keyword)) {
      return res.status(400).json({ message: 'Keyword mengandung karakter tidak valid' });
    }

    const whereClause = keyword
      ? { nama: { [Op.like]: `%${keyword}%` } }
      : {};

    const { count: total, rows } = await Karyawan.findAndCountAll({
      where: whereClause,
      offset: parseInt(start),
      limit: parseInt(count),
      order: [['createdAt', 'DESC']]
    });

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Data karyawan tidak ditemukan' });
    }

    res.json({ total, data: rows });
  } catch (err) {
    res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data', error: err.message });
  }
};

// ✅ [PUT] /karyawan/update/:nip
exports.updateKaryawan = async (req, res) => {
  try {
    const { nip } = req.params;
    const { nama, photo, status } = req.body;

    if (!nip) return res.status(400).json({ message: 'NIP wajib diisi' });

    if (typeof nama !== 'string' || nama.trim() === '') {
      return res.status(400).json({ message: 'Nama wajib diisi dan harus berupa teks' });
    }

    const invalidChars = /[^a-zA-Z0-9\s.,'-]/;
    if (invalidChars.test(nama)) {
      return res.status(400).json({ message: 'Nama mengandung karakter tidak valid' });
    }

    if (!isBase64(photo)) {
      return res.status(400).json({ message: 'Format photo harus base64 valid' });
    }

    const karyawan = await Karyawan.findOne({ where: { nip } });
    if (!karyawan) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    karyawan.nama = nama;
    karyawan.photo = photo;
    if (status !== undefined) {
      karyawan.status = status;
    }

    await karyawan.save();

    res.json({ message: 'Karyawan berhasil diupdate', data: karyawan });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate karyawan', error: err.message });
  }
};

// ✅ [PATCH] /karyawan/deactivate/:nip
exports.deactivateKaryawan = async (req, res) => {
  try {
    const { nip } = req.params;

    if (!nip || typeof nip !== 'string') {
      return res.status(400).json({ message: 'NIP wajib diisi dan harus berupa teks' });
    }

    const invalidChars = /[^0-9]/;
    if (invalidChars.test(nip)) {
      return res.status(400).json({ message: 'NIP mengandung karakter tidak valid' });
    }

    const karyawan = await Karyawan.findOne({ where: { nip } });
    if (!karyawan) {
      return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    }

    karyawan.status = 9;
    await karyawan.save();

    res.json({ message: 'Karyawan berhasil dinonaktifkan', data: karyawan });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menonaktifkan karyawan', error: err.message });
  }
};