require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const db = new PrismaClient();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

// Buat folder uploads kalau belum ada
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ error: "Token tidak ditemukan" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Token tidak valid" });
  }
}

// AUTH
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "name, email, dan password wajib diisi" });
    const existing = await db.user.findUnique({ where: { email } });
    if (existing)
      return res.status(409).json({ error: "Email sudah digunakan" });
    const hashed = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { name, email, password: hashed },
    });
    return res
      .status(201)
      .json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email dan password wajib diisi" });
    const user = await db.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Email atau password salah" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Email atau password salah" });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .json({
        user: { id: user.id, name: user.name, email: user.email },
        token,
      });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ITEMS
app.get("/api/items", async (req, res) => {
  try {
    const { type, status, category } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (category) filter.category = category;
    const items = await db.item.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });
    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get("/api/items/stats", async (req, res) => {
  try {
    const all = await db.item.findMany();
    const total = all.length;
    const resolved = all.filter((i) => i.status === "resolved").length;
    const catCount = {};
    for (const item of all)
      catCount[item.category] = (catCount[item.category] || 0) + 1;
    let topCategory = null,
      maxCount = 0;
    for (const cat in catCount) {
      if (catCount[cat] > maxCount) {
        maxCount = catCount[cat];
        topCategory = cat;
      }
    }
    return res.status(200).json({ total, resolved, topCategory });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post(
  "/api/items",
  verifyToken,
  upload.single("photo"),
  async (req, res) => {
    try {
      const { title, description, location, category, type } = req.body;
      if (!title || !description || !location || !category || !type)
        return res
          .status(400)
          .json({
            error:
              "title, description, location, category, dan type wajib diisi",
          });
      if (type !== "lost" && type !== "found")
        return res.status(400).json({ error: "type harus lost atau found" });

      const imageUrl = req.file
        ? `http://localhost:${PORT}/uploads/${req.file.filename}`
        : null;

      const newItem = await db.item.create({
        data: {
          title,
          description,
          location,
          category,
          type,
          imageUrl,
          userId: req.userId,
        },
      });
      return res.status(201).json(newItem);
    } catch (err) {
      console.error("ERROR POST /api/items:", err.message);
      return res.status(500).json({ error: err.message });
    }
  },
);

app.patch("/api/items/:id/status", verifyToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: "status wajib diisi" });
    const item = await db.item.findUnique({ where: { id: itemId } });
    if (!item)
      return res.status(404).json({ error: "Laporan tidak ditemukan" });
    if (item.userId !== req.userId)
      return res
        .status(403)
        .json({ error: "Tidak berhak mengubah laporan ini" });
    const updated = await db.item.update({
      where: { id: itemId },
      data: { status },
    });
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// CLAIMS
app.get("/api/items/:id/claims", verifyToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await db.item.findUnique({ where: { id: itemId } });
    if (!item)
      return res.status(404).json({ error: "Laporan tidak ditemukan" });
    if (item.userId !== req.userId)
      return res.status(403).json({ error: "Tidak berhak melihat klaim ini" });
    const claims = await db.claim.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
      include: { claimant: { select: { name: true, email: true } } },
    });
    return res.status(200).json(claims);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/items/:id/claims", verifyToken, async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message wajib diisi" });
    const item = await db.item.findUnique({ where: { id: itemId } });
    if (!item)
      return res.status(404).json({ error: "Laporan tidak ditemukan" });
    const claim = await db.claim.create({
      data: { message, itemId, claimantId: req.userId },
    });
    return res.status(201).json(claim);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.patch("/api/claims/:id/respond", verifyToken, async (req, res) => {
  try {
    const claimId = parseInt(req.params.id);
    const { status } = req.body;
    if (status !== "accepted" && status !== "rejected")
      return res
        .status(400)
        .json({ error: "status harus accepted atau rejected" });
    const claim = await db.claim.findUnique({
      where: { id: claimId },
      include: { item: true },
    });
    if (!claim) return res.status(404).json({ error: "Klaim tidak ditemukan" });
    if (claim.item.userId !== req.userId)
      return res.status(403).json({ error: "Tidak berhak merespon klaim ini" });
    const updated = await db.claim.update({
      where: { id: claimId },
      data: { status },
    });
    if (status === "accepted") {
      await db.item.update({
        where: { id: claim.itemId },
        data: { status: "claimed" },
      });
    }
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server Found@Cakrawala jalan di http://localhost:${PORT}`);
});
