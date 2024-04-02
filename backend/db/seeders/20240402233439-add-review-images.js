'use strict';

const { ReviewImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        reviewId: 1,
        url: "https://images.pexels.com/photos/2449605/pexels-photo-2449605.png?auto=compress&cs=tinysrgb&w=600",
      },
      {
        reviewId: 2,
        url: "https://images.pexels.com/photos/18531962/pexels-photo-18531962/free-photo-of-close-up-of-ganesha-statue.jpeg?auto=compress&cs=tinysrgb&w=600",
      }
    ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2] }
    }, {});
  }
};
