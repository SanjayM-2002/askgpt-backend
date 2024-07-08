const { OpenAI } = require('openai');

const configureOpenAI = () => {
  const config = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET,
    // organization: process.env.OPEN_AI_ORG_ID,
  });
  return config;
};

module.exports = { configureOpenAI };
