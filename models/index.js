const sequelize = require('../config/database'); // DB connection

const db = {};               // Master object to hold everything

db.Sequelize = sequelize;    // Sequelize library reference (optional)
db.sequelize = sequelize;    // DB connection instance


module.exports = db;