const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();

router.get('/hello', (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});
router.post('/signup', signup);
router.post('/login', login);
module.exports = router;
