const { Op }  = require("sequelize");
const { User } = require("../models");

// GET /api/users/search?q=
const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ users: [] });

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: req.user.id },
        [Op.or]: [
          { name:  { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: ["id", "name", "email", "avatar", "isOnline", "lastSeen"],
      limit: 10,
    });

    res.json({ users });
  } catch (err) { next(err); }
};

// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findByPk(req.user.id);
    await user.update({ name });
    res.json({ user: user.toPublic() });
  } catch (err) { next(err); }
};

// POST /api/users/avatar  (handled by multer)
const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByPk(req.user.id);
    await user.update({ avatar: avatarUrl });
    res.json({ avatar: avatarUrl });
  } catch (err) { next(err); }
};

module.exports = { searchUsers, updateProfile, uploadAvatar };
