'use strict';

const { User } = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await User.bulkCreate([
      {
        email: 'demo@user.com',
        username: 'Demo-lition',
        firstName: 'Demo',
        lastName: 'Usenhouse',
        hashedPassword: bcrypt.hashSync('password')
      },
      {
        email: 'user123@urmom.com',
        username: 'FakeUser123',
        firstName: 'Frank',
        lastName: "Gallegher",
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        email: 'userthethird@testing.edu',
        username: 'FakeUser3',
        firstName: 'Josie',
        lastName: 'Pink',
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['Demo-lition', 'FakeUser123', 'FakeUser3'] }
    }, {});
  }

};
