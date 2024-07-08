const express = require('express');
const { protectRoute } = require('../middlewares/protectRoute');
const {
  completeChat,
  completeChatGroq,
  fetchUserChats,
  clearUserChats,
} = require('../controllers/chatController');
const router = express.Router();
router.get('/hello', protectRoute, (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});
router.post('/new-chat', protectRoute, completeChatGroq);
router.get('/fetch-chats', protectRoute, fetchUserChats);
router.delete('/clear-chats', protectRoute, clearUserChats);
module.exports = router;
