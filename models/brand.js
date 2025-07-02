module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define('Brand', {
    brandName: DataTypes.STRING,
    detail: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.FLOAT,
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['brandName', 'productId'] // enforce uniqueness on combo
      }
    ]
  });

  Brand.associate = (models) => {
    Brand.belongsTo(models.Product, {
      foreignKey: 'productId',
      as: 'product'
    });
  };

  return Brand;
};