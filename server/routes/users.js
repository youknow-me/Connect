const router  = require("express").Router();
const multer  = require("multer");
const path    = require("path");
const { searchUsers, updateProfile, uploadAvatar } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const avatarUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/avatars/"),
    filename:    (_req, file, cb) =>
      cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`),
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed for avatar"));
  },
});

router.use(protect);

router.get("/search",  searchUsers);
router.put("/profile", updateProfile);
router.post("/avatar", avatarUpload.single("avatar"), uploadAvatar);

module.exports = router;
