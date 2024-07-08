const express = require('express');
const { protectRoute } = require('../middlewares/protectRoute');
const {
  completeChat,
  completeChatGroq,
} = require('../controllers/chatController');
const router = express.Router();
router.get('/hello', (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});
router.post('/new-chat', protectRoute, completeChatGroq);
module.exports = router;
