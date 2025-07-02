module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    role: DataTypes.ENUM('admin', 'seller')
  });

  User.associate = (models) => {
    User.hasOne(models.Seller, { foreignKey: 'userId', onDelete: 'CASCADE' });
   // User.hasMany(models.Product, { foreignKey: 'sellerId', onDelete: 'CASCADE' });
  };

  return User;
};