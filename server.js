const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./models'); 
const app = express();
const routes = require('./routes'); // Works now
const { notFound, errorHandler } = require('./middleware/errorhandler');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Fallback error handlers
app.use(notFound);
app.use(errorHandler);

// Sync DB and start server
db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
});
