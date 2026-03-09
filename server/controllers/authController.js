const jwt  = require("jsonwebtoken");
const { User } = require("../models");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required" });

    const exists = await User.findOne({ where: { email } });
    if (exists)
      return res.status(409).json({ message: "Email already registered" });

    const user  = await User.create({ name, email, password });
    const token = signToken(user.id);

    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) { next(err); }
};

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user.id);
    res.json({ token, user: user.toPublic() });
  } catch (err) { next(err); }
};

// GET /auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user.toPublic ? req.user.toPublic() : req.user });
};

module.exports = { register, login, getMe };
