const router = require("express").Router();
const {
  getConversations,
  createConversation,
  getMessages,
  markRead,
} = require("../controllers/conversationController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);   // all routes require auth

router.get("/",          getConversations);
router.post("/",         createConversation);
router.get("/:id/messages", getMessages);
router.put("/:id/read",     markRead);

module.exports = router;
