'use strict';

const { Review } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 2,
        review: "The bungalow was... as advertised. Still have dreams about it.",
        stars: 3
      },
      {
        spotId: 2,
        userId: 2,
        review: "Pink Palace is exquisite. Tacky, but it knows what its trying to be, and elevates the form in its perfect execution of Atlantic City realness. Please stay here!",
        stars: 5
      },
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2] }
    }, {});
  }
};
