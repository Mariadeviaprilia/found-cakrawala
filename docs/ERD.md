# Entity Relationship Diagram — Found@Cakrawala

3 entitas utama, didefinisikan di `backend/prisma/schema.prisma`.

## Relasi

- **User → Item** (1 : N) — satu user dapat membuat banyak laporan barang. Relasi lewat `Item.userId`.
- **Item → Claim** (1 : N) — satu laporan dapat menerima banyak klaim dari user berbeda. Relasi lewat `Claim.itemId`.
- **User → Claim** (1 : N, sebagai `claimant`) — satu user dapat mengajukan banyak klaim atas laporan-laporan berbeda. Relasi lewat `Claim.claimantId`.

## Field Utama

**User**

- `id`, `name`, `email` (unik)
- `password` (di-hash dengan bcrypt)
- `createdAt`

**Item**

- `id`, `title`, `description`, `location`, `category`
- `type` — `lost` (barang hilang) atau `found` (barang ditemukan)
- `status` — `open` (default) → `claimed` (klaim disetujui) → bisa diubah pelapor jadi `resolved`
- `imageUrl`, `createdAt`

**Claim**

- `id`, `message`
- `status` — `pending` (default) → `accepted` / `rejected` oleh pelapor
- `createdAt`

Saat sebuah `Claim` di-set `accepted` melalui `PATCH /api/claims/:id/respond`, `Item` terkait otomatis ikut ter-update statusnya menjadi `claimed` (lihat `docs/API.md`).
