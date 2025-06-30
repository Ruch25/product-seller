// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models'); 
const app = express();
const PORT = process.env.PORT || 5000;
const { notFound, errorHandler } = require('./middleware/errorhandler');


// Middleware
app.use(cors());
app.use(express.json());
app.use(notFound);
app.use(errorHandler);

// Basic route
app.get('/', (req, res) => {
    res.send('API is running 🚀');
});

// Sync DB and start server
db.sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
