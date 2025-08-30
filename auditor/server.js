require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const reportController = require('./src/controllers/reportController');

const app = express();
app.use(bodyParser.json());

app.use('/api/reports', reportController);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

