const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // DB connection

const db = {};               // Master object to hold everything

db.Sequelize = sequelize;    // Sequelize library reference (optional)
db.sequelize = sequelize;    // DB connection instance

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Seller = require('./seller')(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) db[modelName].associate(db);
});

module.exports = db;