const db = require('../models');

// exports.addProduct = async (req, res) => {
//   const t = await db.sequelize.transaction();
//   try {
//     const { productName, description, brands } = req.body;

//     if (req.user.role !== 'seller') {
//       return res.status(403).json({ message: 'Only sellers can add products' });
//     }

//     // Create Product
//     const product = await db.Product.create({
//       productName,
//       description,
//       sellerId: req.user.id
//     }, { transaction: t });

//     // Add Brands
//     const brandData = brands.map(brand => ({
//       ...brand, //use of rest opreator to include all brand properties
//       productId: product.id
//     }));

//     await db.Brand.bulkCreate(brandData, { transaction: t });

//     await t.commit();
//     res.status(201).json({ message: 'Product created successfully' });

//   } catch (err) {
//     await t.rollback();
//     res.status(500).json({ message: 'Error creating product', error: err.message });
//   }
// };

//addProduct function to handle product creation with brand validation
exports.addProduct = async (req, res) => {
  const t = await db.sequelize.transaction();
  try {
    if (req.user.role !== 'seller') {
      return res.status(403).json({ message: 'Only sellers can add products' });
    }

    const products = Array.isArray(req.body) ? req.body : [req.body]; // support single or multiple

    const createdProducts = [];

    for (const item of products) {
      const { productName, description, brands } = item;

       // Check for existing product with same brand combo
        for (const brand of brands) {
                const existing = await db.Product.findOne({
                where: { productName },
                include: [{
                    model: db.Brand,
                    where: { brandName: brand.brandName }
                }]
            });

            if (existing) {
            return res.status(400).json({
                message: `Duplicate combination found: Product "${productName}" already has brand "${brand.brandName}"`
            });
            }
        }
       

      // Create product
      const product = await db.Product.create({
        productName,
        description,
        sellerId: req.user.id
      }, { transaction: t });

      // Create brands for that product
      const brandData = brands.map(brand => ({
        ...brand,
        productId: product.id
      }));

      await db.Brand.bulkCreate(brandData, { transaction: t });

      createdProducts.push({
        id: product.id,
        name: productName,
        brands: brandData.map(b => b.brandName)
      });
    }

    await t.commit();
    return res.status(201).json({
      message: 'Products created successfully',
      products: createdProducts
    });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ message: 'Error creating product(s)', error: err.message });
  }
};

// Function to get products added by the authenticated seller
exports.getMyProducts = async (req, res) => {
  try {
    const sellerId = req.user.id; // Authenticated seller

    const { page = 1, limit = 5, filter = {} } = req.body; // body-based pagination + filters optional future reference
    const offset = (page - 1) * limit;

    const whereCondition = {
      sellerId,
      ...(filter.productName && { productName: { [db.Sequelize.Op.like]: `%${filter.productName}%` } })
    };

    const { count, rows } = await db.Product.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: db.Brand,
          as: 'brands',
          attributes: ['brandName', 'detail', 'image', 'price']
        }
      ],
       distinct: true,
      limit,
      offset,
      //order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      products: rows
    });

  } catch (err) {
    console.error('Get Products Error:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const t = await db.sequelize.transaction();

  try {
    const sellerId = req.user.id;
    const productId = parseInt(req.params.id);


    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: 'Invalid Product ID' });
    }

    //  Find the product with seller ownership check
    const product = await db.Product.findOne({
      where: { id: productId, sellerId }
    });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found or you are not authorized to delete this product'
      });
    }

    //  Delete related brands (optional if ON DELETE CASCADE is not used)
    await db.Brand.destroy({ where: { productId }, transaction: t });

    // Delete the product
    await db.Product.destroy({ where: { id: productId }, transaction: t });

    await t.commit();

    return res.status(200).json({
      message: 'Product deleted successfully'
    });

  } catch (err) {
    await t.rollback();
    console.error(' Error in deleteProduct:', err);
    return res.status(500).json({
      message: 'Internal server error',
      error: err.message
    });
  }
};