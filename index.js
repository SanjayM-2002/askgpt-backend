const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 5000;
const connectDb = require('./db/connectDb');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
connectDb();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Health check success' });
});

app.use('/api/v1/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
