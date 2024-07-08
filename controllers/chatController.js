const { z } = require('zod');
const { User } = require('../models/userModel');
const { configureOpenAI } = require('../config/openAiConfig');
const { OpenAI } = require('openai');
const { Groq } = require('groq-sdk');

const chatInputSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty' }),
});

const groqApiKey = process.env.GROQ_API_KEY;

const completeChat = async (req, res) => {
  const messageBody = req.body;
  try {
    const zodResponse = chatInputSchema.safeParse(messageBody);
    if (!zodResponse.success) {
      return res.status(411).json(zodResponse.error.message);
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const chatArray = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));
    chatArray.push({ role: 'user', content: zodResponse.data.message });
    user.chats.push({ role: 'user', content: zodResponse.data.message });
    const config = configureOpenAI();
    const openai = new OpenAI(config);
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      //   model: 'text-embedding-3-small',
      messages: chatArray,
    });
    // console.log('response is: ', chatResponse.choices[0].message);
    user.chats.push(chatResponse.choices[0].message);
    await user.save();
    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log('Error caught is: ', error.message);
    return res
      .status(500)
      .json({ error: 'Server error', errorDetails: error.message });
  }
};

const completeChatGroq = async (req, res) => {
  const messageBody = req.body;
  try {
    const zodResponse = chatInputSchema.safeParse(messageBody);
    if (!zodResponse.success) {
      return res.status(411).json(zodResponse.error.message);
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const chatArray = user.chats.map(({ role, content }) => ({
      role,
      content,
    }));
    chatArray.push({ role: 'user', content: zodResponse.data.message });
    user.chats.push({ role: 'user', content: zodResponse.data.message });
    const groq = new Groq({
      apiKey: groqApiKey,
    });
    const chatResponse = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: chatArray,
    });
    // console.log('response is: ', chatResponse.choices[0].message);
    user.chats.push(chatResponse.choices[0].message);
    await user.save();
    return res.status(200).json({ message: 'Success', chats: user.chats });
  } catch (error) {
    console.log('Error caught is: ', error.message);
    return res
      .status(500)
      .json({ error: 'Server error', errorDetails: error.message });
  }
};

const fetchUserChats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    const userchats = user.chats;
    return res.status(200).json({ message: 'Success', userchats });
  } catch (error) {
    console.log('Error caught is: ', error.message);
    return res
      .status(500)
      .json({ error: 'Server error', errorDetails: error.message });
  }
};

const clearUserChats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    console.log('Error caught is: ', error.message);
    return res
      .status(500)
      .json({ error: 'Server error', errorDetails: error.message });
  }
};

module.exports = {
  completeChat,
  completeChatGroq,
  fetchUserChats,
  clearUserChats,
};
