const bcrypt = require('bcryptjs');
const { z } = require('zod');
const { User } = require('../models/userModel');
const {
  generateTokenAndSetCookie,
} = require('../utils/generateTokenAndSetCookie');

const signupSchema = z.object({
  fullname: z.string().min(1, { message: 'Fullname cannot be empty' }),
  email: z.string().min(1).email({ message: 'This is not a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password should have minimum 8 characters' }),
});

const loginSchema = z.object({
  email: z.string().min(1).email({ message: 'This is not a valid email' }),
  password: z
    .string()
    .min(8, { message: 'Password should have minimum 8 characters' }),
});

const signup = async (req, res) => {
  const signupBody = req.body;
  try {
    console.log('signup body is: ', signupBody);
    const zodResponse = signupSchema.safeParse(signupBody);
    if (!zodResponse.success) {
      return res.status(411).json(zodResponse.error.message);
    }
    const isUserExist = await User.findOne({ email: zodResponse.data.email });
    if (isUserExist) {
      return res
        .status(400)
        .json({ error: 'User with this email already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(zodResponse.data.password, salt);
    console.log('hashed password is: ', hashedPassword);
    const newUser = new User({
      fullname: zodResponse.data.fullname,
      email: zodResponse.data.email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    generateTokenAndSetCookie(savedUser._id.toString(), res);
    return res.status(201).json({
      userDetails: {
        _id: savedUser._id,
        fullname: savedUser.fullname,
        email: savedUser.email,
      },
      message: 'Signed up successfully',
    });
  } catch (error) {
    console.log('Error caught is: ', error.message);
    return res
      .status(500)
      .json({ error: 'Server error', errorDetails: error.message });
  }
};

const login = async (req, res) => {
  const loginBody = req.body;
  try {
    console.log('login body is: ', loginBody);
    const zodResponse = loginSchema.safeParse(loginBody);
    if (!zodResponse.success) {
      return res.status(411).json(zodResponse.error.message);
    }
    const user = await User.findOne({ email: zodResponse.data.email });
    if (!user) {
      return res.status(400).json({ error: 'No user with given email exists' });
    }
    console.log('user password is: ', user.password);
    console.log('input password is: ', zodResponse.data.password);
    const isPasswordCorrect = await bcrypt.compare(
      zodResponse.data.password,
      user.password
    );
    console.log('is password correct: ', isPasswordCorrect);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    generateTokenAndSetCookie(user._id.toString(), res);
    return res.status(200).json({
      userDetails: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
      message: 'Logged in successfully',
    });
  } catch (error) {
    console.log('Error caught is: ', error.message);
    return res
      .status(500)
      .json({ error: 'Server error', errorDetails: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).json({ message: 'Logged out successfully' });
    console.log('Logged out successfully');
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log('Error in logout', err.message);
  }
};

module.exports = { signup, login, logout };
