# API Documentation — Found@Cakrawala

Base URL (lokal): `http://localhost:3000`

Semua request/response berformat JSON, kecuali `POST /api/items` yang menggunakan `multipart/form-data` (untuk upload foto).

Endpoint yang memerlukan autentikasi wajib menyertakan header:
Authorization: Bearer <token>

Token didapat dari response `POST /api/auth/login`.

---

## Auth

### `POST /api/auth/register`

Registrasi akun baru.

**Request body**

```json
{
  "name": "Maria Devi",
  "email": "maria@kampus.ac.id",
  "password": "rahasia123"
}
```

**Response `201 Created`**

```json
{ "user": { "id": 1, "name": "Maria Devi", "email": "maria@kampus.ac.id" } }
```

**Error**: `400` jika field kosong, `409` jika email sudah terdaftar.

---

### `POST /api/auth/login`

Login dan mendapatkan JWT.

**Request body**

```json
{ "email": "maria@kampus.ac.id", "password": "rahasia123" }
```

**Response `200 OK`**

```json
{
  "user": { "id": 1, "name": "Maria Devi", "email": "maria@kampus.ac.id" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Error**: `401` jika email/password salah.

---

## Items

### `GET /api/items`

Mengambil daftar laporan barang. Publik (tidak perlu token).

**Query params** (opsional)
| Param | Keterangan |
| ---------- | ------------------------------------ |
| `type` | `lost` atau `found` |
| `status` | `open`, `claimed`, `resolved`, dst. |
| `category` | nama kategori barang |

**Response `200 OK`**

```json
[
  {
    "id": 3,
    "title": "Dompet coklat",
    "description": "Ditemukan di kantin",
    "location": "Kantin Gedung B",
    "category": "Dompet",
    "type": "found",
    "status": "open",
    "imageUrl": "http://localhost:3000/uploads/167...jpg",
    "createdAt": "2026-07-01T02:00:00.000Z",
    "user": { "name": "Maria Devi" }
  }
]
```

---

### `GET /api/items/stats`

Statistik ringkas seluruh laporan. Publik.

**Response `200 OK`**

```json
{ "total": 12, "resolved": 5, "topCategory": "Dompet" }
```

---

### `POST /api/items` 🔒 JWT

Membuat laporan baru. Body dikirim sebagai `multipart/form-data`.

**Form fields**
| Field | Wajib | Keterangan |
| ------------- | ----- | -------------------------- |
| `title` | ✅ | Judul laporan |
| `description` | ✅ | Deskripsi barang |
| `location` | ✅ | Lokasi hilang/ditemukan |
| `category` | ✅ | Kategori barang |
| `type` | ✅ | `lost` atau `found` |
| `photo` | ❌ | File foto (maks. 5MB) |

**Response `201 Created`** — objek `Item` yang baru dibuat.

**Error**: `400` jika field wajib kosong atau `type` tidak valid, `401` jika tanpa token.

---

### `PATCH /api/items/:id/status` 🔒 JWT

Mengubah status laporan. Hanya bisa dilakukan oleh pelapor (pemilik) laporan tersebut.

**Request body**

```json
{ "status": "resolved" }
```

**Response `200 OK`** — objek `Item` yang telah diperbarui.

**Error**: `403` jika bukan pemilik laporan, `404` jika laporan tidak ditemukan.

---

### `DELETE /api/items/:id` 🔒 JWT

Menghapus laporan. Hanya bisa dilakukan oleh pelapor (pemilik) laporan tersebut. Klaim yang terkait dengan laporan ini ikut terhapus.

**Response `200 OK`**

```json
{ "message": "Laporan berhasil dihapus" }
```

**Error**: `403` jika bukan pemilik laporan, `404` jika laporan tidak ditemukan.

---

## Claims

### `GET /api/items/:id/claims` 🔒 JWT

Melihat semua klaim yang masuk untuk suatu laporan. Hanya bisa dilihat oleh pemilik laporan.

**Response `200 OK`**

```json
[
  {
    "id": 5,
    "message": "Ini dompet saya, ada foto KTM di dalamnya",
    "status": "pending",
    "createdAt": "2026-07-02T03:00:00.000Z",
    "claimant": { "name": "Budi", "email": "budi@kampus.ac.id" }
  }
]
```

**Error**: `403` jika bukan pemilik laporan.

---

### `POST /api/items/:id/claims` 🔒 JWT

Mengajukan klaim atas suatu laporan.

**Request body**

```json
{ "message": "Ini dompet saya, ada foto KTM di dalamnya" }
```

**Response `201 Created`** — objek `Claim` yang baru dibuat (status awal: `pending`).

---

### `PATCH /api/claims/:id/respond` 🔒 JWT

Menyetujui atau menolak klaim yang masuk. Hanya bisa dilakukan oleh pemilik laporan terkait.

**Request body**

```json
{ "status": "accepted" }
```

`status` harus `accepted` atau `rejected`.

**Response `200 OK`** — objek `Claim` yang telah diperbarui. Jika `status` adalah `accepted`, laporan (`Item`) terkait otomatis berubah status menjadi `claimed`.

**Error**: `403` jika bukan pemilik laporan, `400` jika `status` tidak valid.
