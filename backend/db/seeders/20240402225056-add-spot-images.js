'use strict';

const { SpotImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId: 1,
        url: "https://images.pexels.com/photos/4917176/pexels-photo-4917176.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: false,
      },
      {
        spotId: 2,
        url: "https://images.pexels.com/photos/17899185/pexels-photo-17899185/free-photo-of-pink-sofa-and-velvet-chairs-around-a-wooden-table-in-the-living-room.jpeg?auto=compress&cs=tinysrgb&w=600",
        preview: true,
      }
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2] }
    }, {});
  }
};
