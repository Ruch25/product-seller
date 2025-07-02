module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productName: DataTypes.STRING,
    description: DataTypes.TEXT,
    sellerId: DataTypes.INTEGER
  });

  Product.associate = (models) => {
    Product.hasMany(models.Brand, { foreignKey: 'productId', as: 'brands' });
    Product.belongsTo(models.User, { foreignKey: 'sellerId', as: 'seller' });
  };

  return Product;
};
