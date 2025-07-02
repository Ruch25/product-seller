const db = require('../models');
const bcrypt = require('bcrypt');

// exports.createSeller = async (req, res) => {
//   const t = await db.sequelize.transaction();

//   try {
//     const { name, email, mobile, country, state, skills, password } = req.body;

//     const existingUser = await db.User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(409).json({ message: 'Email already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 1. Insert into `users`
//     const newUser = await db.User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: 'seller'
//     }, { transaction: t });

//     // 2. Insert into `sellers`
//     await db.Seller.create({
//       userId: newUser.id,
//       mobile,
//       country,
//       state,
//       skills: skills.join(',') 
//     }, { transaction: t });

//     await t.commit();

//     res.status(201).json({ message: 'Seller created successfully' });

//   } catch (err) {
//     await t.rollback();
//     console.error(err);
//     res.status(500).json({ message: 'Something went wrong', error: err.message });
//   }
// };

exports.createSeller = async (req, res) => {
  const inputData = req.body;

  // Normalize to array
  const sellers = Array.isArray(inputData) ? inputData : [inputData];

  try {
    for (const seller of sellers) {
      const t = await db.sequelize.transaction();

      const { name, email, mobile, country, state, skills, password } = seller;

      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        await t.rollback();
        return res.status(409).json({ message: `Email already exists: ${email}` });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // 1. Insert into `users`
      const newUser = await db.User.create({
        name,
        email,
        password: hashedPassword,
        role: 'seller'
      }, { transaction: t });

      // 2. Insert into `sellers`
      await db.Seller.create({
        userId: newUser.id,
        mobile,
        country,
        state,
        skills: skills.join(',')
      }, { transaction: t });

      await t.commit();
    }

    res.status(201).json({ message: `${sellers.length} seller(s) created successfully` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
};


exports.getSellers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;        // Default page = 1
    const limit = parseInt(req.query.limit) || 5;     // Default limit = 5
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Seller.findAndCountAll({
      include: [
        {
          model: db.User,
          attributes: ['name', 'email']
        }
      ],
      attributes: { exclude: ['userId'] },
      limit,
      offset
    });

    res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      sellers: rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};