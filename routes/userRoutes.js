const express = require('express');
const { signup } = require('../controllers/userController');
const router = express.Router();

router.get('/hello', (req, res) => {
  console.log('hello world');
  res.json({ msg: 'hello world' });
});
router.post('/signup', signup);
module.exports = router;
