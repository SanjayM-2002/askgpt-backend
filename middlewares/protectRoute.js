const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log('token inside middleware is: ', token);
    if (!token) {
      return res.status(400).json({ error: 'Unauthorised user' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded inside middleware is: ', decoded);
    const user = await User.findById(decoded.userId);
    console.log('user object is: ', user);
    req.user = user;
    console.log('Middleware function returned successfully');
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log('Error in auth middleware', error.message);
  }
};

module.exports = { protectRoute };
