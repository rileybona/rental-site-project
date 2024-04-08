const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth')
const { handleValidationErrors } = require('../../utils/validation');

const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { ReviewImage } = require("../../db/models");
const { Booking } = require('../../db/models');


// GET ALL BOOKINGS BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
    const { user } = req;
    const bookings = await Booking.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: Spot,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }]
    })

    // improve time formatting:

    // startDate & endDate
        // expected: "2021-11-19"
        // actual: "2023-11-19T00:00:00.000Z"

     // createdAt & updatedAt
        // expected: "2021-11-19 20:39:36",
        // actual: "2024-04-03T15:57:47.152Z"

    // for each booking ...
    bookings.forEach((booking) => {
        // re format start date
        let start = new Date(booking.startDate);
        start = start.toDateString();

        delete booking.dataValues.startDate;
        booking.dataValues.startDate = start;

        // re format end date
        let end = new Date(booking.endDate);
        end = end.toDateString();

        delete booking.dataValues.endDate;
        booking.dataValues.endDate = end;

        // re format createdAt
        let created = new Date(booking.createdAt);
        created = created.toUTCString();

        delete booking.dataValues.createdAt;
        booking.dataValues.createdAt = created;

        // re format updatedAt
        let updated= new Date(booking.updatedAt);
        updated= updated.toUTCString();

        delete booking.dataValues.updatedAt;
        booking.dataValues.updatedAt = updated;

    });




    res.json(bookings);
})




module.exports = router;
