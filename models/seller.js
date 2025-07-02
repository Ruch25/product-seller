module.exports = (sequelize, DataTypes) => {
  const Seller = sequelize.define('Seller', {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    mobile: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    skills: {
      type: DataTypes.JSON, 
      allowNull: false
    }
  });

  Seller.associate = (models) => {
    Seller.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Seller;
};
