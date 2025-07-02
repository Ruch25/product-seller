const Joi = require('joi');

// Admin and seller Login Validator
exports.validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        'string.email': 'Invalid email format',
        'string.empty': 'Email is required'
      }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};


// exports.validateCreateSeller = (req, res, next) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     email: Joi.string().email().required(),
//     mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
//     country: Joi.string().allow('',null),
//     state: Joi.string().allow('',null),
//     skills: Joi.array().items(Joi.string()).required(),
//     password: Joi.string().min(6).required()
//   });

  

//   const { error } = schema.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   next();
// };



exports.validateCreateSeller = (req, res, next) => {
  const data = req.body;

  const sellerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required(),
    country: Joi.string().allow('', null),
    state: Joi.string().allow('', null),
    skills: Joi.array().items(Joi.string()).required(),
    password: Joi.string().min(6).required()
    });


  const result = Array.isArray(data)
    ? Joi.array().items(sellerSchema).validate(data)
    : sellerSchema.validate(data);

  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message });
  }

  next();
};

// exports.validateAddProduct = (req, res, next) => {
//   const schema = Joi.object({
//     productName: Joi.string().required(),
//     description: Joi.string().required(),
//     brands: Joi.array().items(
//       Joi.object({
//         brandName: Joi.string().required(),
//         detail: Joi.string().required(),
//         image: Joi.string().uri().required(),
//         price: Joi.number().positive().required()
//       })
//     ).min(1).required()
//   });

//   const { error } = schema.validate(req.body);
//   if (error) return res.status(400).json({ message: error.details[0].message });

//   next();
// };





// Main middleware
exports.validateAddProduct = (req, res, next) => {
  const body = req.body;
  const productSchema = Joi.object({
  productName: Joi.string().required(),
  description: Joi.string().allow('', null),
  brands: Joi.array().items(
    Joi.object({
      brandName: Joi.string().required(),
      detail: Joi.string().allow('', null),
      image: Joi.string().uri().required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required()
});


  const products = Array.isArray(body) ? body : [body];

  const schemaToValidate = Array.isArray(body)
    ? Joi.array().items(productSchema)
    : productSchema;

  const { error } = schemaToValidate.validate(body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // Product name duplication within the request
  const productBrandComboSet = new Set();

  for (const product of products) {
    const seenBrands = new Set();

    for (const brand of product.brands) {
      const comboKey = `${product.productName.toLowerCase()}|${brand.brandName.toLowerCase()}`;

      if (productBrandComboSet.has(comboKey)) {
        return res.status(400).json({
          message: `Duplicate combination of product "${product.productName}" and brand "${brand.brandName}" in request`
        });
      }

      if (seenBrands.has(brand.brandName)) {
        return res.status(400).json({
          message: `Duplicate brand "${brand.brandName}" in product "${product.productName}"`
        });
      }

      seenBrands.add(brand.brandName);
      productBrandComboSet.add(comboKey);
    }
  }

  next();
};

exports.validateGetMyProducts = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    filter: Joi.object({
      productName: Joi.string().optional()
    }).optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};