# BackendTest Nexa - Alfian Fathur Rohman

## 📘 Deskripsi
Aplikasi RESTful API untuk manajemen data karyawan dengan autentikasi berbasis token.

Dibangun menggunakan:
- Node.js (Express.js)
- Sequelize ORM
- MySQL
- Docker & Docker Compose

## 📦 Fitur
### ✅ Autentikasi Admin
- [POST] `/auth/login` – Login admin dan mendapatkan token (JWT)

### ✅ Manajemen Karyawan
- [POST] `/karyawan/create` – Tambah karyawan baru (wajib token)
- [GET] `/karyawan/list?keyword=&start=0&count=10` – Daftar karyawan dengan pagination (wajib token)
- [PUT] `/karyawan/update/:nip` – Update data karyawan berdasarkan NIP (wajib token)
- [DELETE] `/karyawan/delete/:nip` – Hapus data karyawan berdasarkan NIP (wajib token)

> Setiap endpoint melakukan validasi field kosong, karakter spesial, dan handling kesalahan.

---

## ⚙️ Konfigurasi .env
Buat file `.env` di root dengan isi:

```env
DB_HOST=gmedia.bz
DB_PORT=3306
DB_USER=gmedia_democase2
DB_PASS=Janglidalam29J
DB_NAME=gmedia_democase
JWT_SECRET=nexatest
AES_KEY=nexatest

Jalankan Proyek dengan Docker
1. Build dan Start Service
docker-compose up --build
2. Jalankan Migration
Buka terminal container:
docker exec -it <web_container_name> sh
npx sequelize-cli db:migrate
3. Jalankan Seeder
npx sequelize-cli db:seed:all
Seeder akan membuat data admin awal, contoh:

{
  "username": "testdata",
  "password": "databaru" (dienkripsi)
}
Gunakan docker ps untuk melihat nama container web, lalu ganti <web_container_name> di atas.

🧪 Tes API
1. Login
Endpoint: POST /auth/login
Body:

{
  "username": "testdata",
  "password": "password123"
}

2. Untuk CRUD Karyawan perlu memasukan token yang didapat dari login ke tab Authorization-Bearer Token