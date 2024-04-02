'use strict';

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
        {
          ownerId: 1,
          address: "134 Puritan Ln",
          city: "Austin",
          state: "Texas",
          country: "United States of America",
          lat: -25.57630,
          lng: -32.52991,
          name: "Demo's Bungallow",
          description: "check out Demo's Bungallow for a harrowing trip down memory lane in Austin's abandoned high school district",
          price: 81.00
        },
        {
          ownerId: 3,
          address: "222 South Shore Blvd",
          city: "Atlantic City",
          state: "New Jersey",
          country: "United States of America",
          lat: 39.2951921,
          lng: 159.1773234,
          name: "Pink Palace",
          description: "Marble statues. Huge Bathtub. Chocolates on the pillows, bitch.",
          price: 99.99
        },
      ], { validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return await queryInterface.bulkDelete(options, {
      address: { [Op.in]: ["134 Puritan Ln", "222 South Shore Blvd"] }
    }, {});
  }
};
