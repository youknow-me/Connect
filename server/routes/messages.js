const router  = require("express").Router();
const multer  = require("multer");
const path    = require("path");
const { sendMessage, deleteMessage, editMessage } = require("../controllers/messageController");
const { protect } = require("../middleware/authMiddleware");

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename:    (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip/;
    const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk  = allowed.test(file.mimetype);
    if (extOk || mimeOk) cb(null, true);
    else cb(new Error("File type not allowed"));
  },
});

router.use(protect);

router.post("/",        upload.single("file"), sendMessage);
router.put("/:id",      editMessage);
router.delete("/:id",   deleteMessage);

module.exports = router;
