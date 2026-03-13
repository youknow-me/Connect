require("dotenv").config();
const express   = require("express");
const http      = require("http");
const { Server } = require("socket.io");
const cors      = require("cors");
const path      = require("path");

const { sequelize } = require("./models");
const socketHandler = require("./socket/socketHandler");

// Routes
const authRoutes         = require("./routes/auth");
const userRoutes         = require("./routes/users");
const conversationRoutes = require("./routes/conversations");
const messageRoutes      = require("./routes/messages");

const app    = express();
const server = http.createServer(app);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io to requests so controllers can emit if needed
app.use((req, _res, next) => { req.io = io; next(); });

socketHandler(io);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/auth",     authRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages",      messageRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date() }));

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })   // use { force: true } to reset DB in dev
  .then(() => {
    console.log("✅ Database synced");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  });
