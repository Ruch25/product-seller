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
