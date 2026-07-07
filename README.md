# Found@Cakrawala

**Aplikasi web fullstack untuk melaporkan, mencari, dan mengklaim barang hilang/ditemukan di lingkungan kampus.**

Proyek akhir individu untuk mata kuliah **Web Advanced Development**.

> Maria Devi Aprilia — NIM 24110400032

Selama ini barang hilang atau ditemukan di kampus cuma disebar lewat grup WhatsApp atau papan pengumuman fisik — cepat hilang, tidak terorganisir, dan nggak jelas apakah barangnya sudah kembali ke pemiliknya. Found@Cakrawala menyediakan satu tempat terpusat untuk melaporkan, mencari, dan mengklaim barang, lengkap dengan status yang terdokumentasi dari awal laporan sampai barang kembali ke pemiliknya.

## Cara Kerja Singkat

Aplikasi ini terdiri dari dua bagian yang jalan terpisah: **backend** (REST API di Express, port 3000) dan **frontend** (React di Vite, port 5173). Frontend memanggil API lewat Axios, dan setiap request yang butuh login menyertakan JWT di header `Authorization: Bearer <token>`. Backend memverifikasi token itu lewat middleware sebelum mengizinkan akses ke data, lalu Prisma yang menerjemahkan query ke SQLite.

Alur intinya: user register/login → lapor barang (hilang atau ditemukan) → user lain bisa cari & filter laporan → kalau merasa itu barangnya, user mengajukan klaim → pelapor asli yang menerima notifikasi klaim, lalu menyetujui atau menolak → kalau disetujui, status laporan otomatis berubah jadi `claimed`.

## Fitur

- Registrasi & login dengan JWT
- Lapor barang hilang/ditemukan lengkap dengan deskripsi, lokasi, kategori, dan foto
- Daftar laporan dengan filter tipe, status, dan kategori
- Ajukan klaim atas suatu laporan; pemilik laporan bisa menyetujui atau menolak
- Status laporan otomatis jadi `claimed` saat klaim disetujui
- Dashboard ringkas: total laporan, jumlah selesai, kategori paling sering dilaporkan
- Hanya pelapor asli yang bisa mengubah status laporannya atau merespon klaim yang masuk (ownership-based authorization, bukan cuma cek "ada token atau tidak")

## Tech Stack

| Layer       | Teknologi                           |
| ----------- | ----------------------------------- |
| Backend     | Node.js + Express.js                |
| Frontend    | React (Vite) + Axios + React Router |
| ORM         | Prisma                              |
| Database    | SQLite                              |
| Autentikasi | JWT + bcrypt                        |
| Upload foto | Multer (disimpan di server)         |

## Struktur Folder
​```
found-cakrawala/
├── backend/            # REST API (Express + Prisma)
│   ├── prisma/          # schema & migrations
│   ├── src/             # source code API
│   └── uploads/         # foto laporan yang diupload
├── frontend/            # Aplikasi React (Vite)
│   └── src/
│       ├── pages/       # Landing, Login, Register, Items, ItemDetail
│       └── services/    # axios API client
└── docs/                # dokumentasi tambahan
    ├── API.md
    └── ERD.md
​```

## Entitas Data

Ada 3 model utama, semuanya saling terhubung lewat relasi one-to-many (detail field & relasinya ada di [`docs/ERD.md`](docs/ERD.md)):

- **User** — akun mahasiswa. Satu user bisa membuat banyak laporan (`Item`), dan bisa juga mengajukan banyak klaim (`Claim`) atas laporan orang lain.
- **Item** — laporan barang hilang/ditemukan. Setiap laporan dipunyai satu `User` (pelapor) dan bisa menerima banyak `Claim` dari user lain.
- **Claim** — pengajuan klaim atas suatu `Item`. Statusnya `pending` sampai pelapor merespon jadi `accepted` atau `rejected`.

## REST API

9 endpoint, 6 di antaranya diproteksi JWT — hanya user yang login yang bisa mengaksesnya, dan beberapa di antaranya (update status, respon klaim) hanya bisa dilakukan oleh pemilik data itu sendiri. Detail request/response lengkap ada di [`docs/API.md`](docs/API.md).

| Method | Endpoint                  | Auth | Fungsi                                       |
| ------ | ------------------------- | ---- | -------------------------------------------- |
| POST   | `/api/auth/register`      | -    | Registrasi akun baru                         |
| POST   | `/api/auth/login`         | -    | Login & menerbitkan JWT                      |
| GET    | `/api/items`              | -    | Daftar laporan (filter type/status/kategori) |
| GET    | `/api/items/stats`        | -    | Statistik ringkas laporan                    |
| POST   | `/api/items`              | JWT  | Membuat laporan baru + upload foto           |
| PATCH  | `/api/items/:id/status`   | JWT  | Ubah status laporan (hanya pelapor)          |
| GET    | `/api/items/:id/claims`   | JWT  | Lihat klaim masuk (hanya pelapor)            |
| POST   | `/api/items/:id/claims`   | JWT  | Mengajukan klaim atas laporan                |
| PATCH  | `/api/claims/:id/respond` | JWT  | Setujui/tolak klaim (hanya pelapor)          |

## Menjalankan Secara Lokal

Butuh Node.js v18+ dan npm.

**Backend**

```bash
cd backend
npm install
cp .env.example .env      # isi JWT_SECRET dengan string rahasia sendiri
npx prisma migrate dev    # bikin database SQLite + tabel
node src/index.js         # jalan di http://localhost:3000
```

`package.json` belum punya script `start`/`dev`, jadi jalankan langsung dengan `node src/index.js`, atau pakai `nodemon src/index.js` (sudah ada di `devDependencies`) kalau mau auto-reload pas develop.

**Frontend**

```bash
cd frontend
npm install
npm run dev                # jalan di http://localhost:5173
```

Frontend manggil API di `http://localhost:3000` secara default. Kalau backend dijalankan di port atau host lain, sesuaikan base URL-nya di `frontend/src/services/api.js`.

## Catatan Perubahan dari Proposal

Proposal awal merencanakan frontend HTML/CSS/Vanilla JS dan foto disimpan sebagai URL eksternal. Di implementasi ini, dua hal itu di-upgrade jadi React + Vite dan upload file lewat Multer, supaya lebih dekat ke kondisi aplikasi nyata (SPA architecture & penanganan `multipart/form-data`). Semua syarat wajib proposal — business requirement, jumlah entitas, jumlah endpoint, penggunaan JWT — tetap terpenuhi dan bahkan terlampaui. Detail perbandingan lengkapnya ada di laporan slide yang dikumpulkan terpisah.

## Pengembangan Selanjutnya

- Notifikasi otomatis saat ada laporan baru yang cocok dengan kata kunci yang dicari user
- Role admin untuk moderasi laporan
- Endpoint `GET /api/items/:id` untuk ambil detail satu laporan langsung dari server (saat ini detailnya masih difilter dari hasil `GET /api/items` di sisi frontend)
- Agregasi statistik pakai Prisma `groupBy` alih-alih dihitung manual di kode
