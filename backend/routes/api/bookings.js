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
});

// EDIT A BOOKING
function validateParams (startDate, endDate) {
    // create our error stuff
       const valErr = new Error();
       let errs = {};

       let paramStart = new Date(startDate);
       paramStart = paramStart.getTime();
       let paramEnd = new Date(endDate);
       paramEnd = paramEnd.getTime();
       let now = Date.now();

       // ensure start date is before today
       if (paramStart < now) {
           errs.startDate = "startDate cannot be in the past";
           valErr.errors = errs;
           valErr.status = 400;
           valErr.message = "Bad Request";
       }
       // ensure end date is after the start date
       if (paramEnd < paramStart) {
           errs.startDate = "endDate cannot be before start date";
           valErr.errors = errs;
           valErr.status = 400;
           valErr.message = "Bad Request";
       }
       if (valErr.status === 400) throw valErr;
   }

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) {
        const err = new Error();
        err.status = 404;
        err.message = "Booking couldn't be found";
        return next(err);
    }
    const { user } = req;
    if (booking.userId !== user.id) {
        const err = new Error();
        err.status = 403;
        err.message = "You are not authorized to edit this booking";
        return next(err);
    }
    // validate params
    const { startDate, endDate } = req.body;
    validateParams(startDate, endDate);

    // handle booking conflict
    const spot = await Spot.findByPk(booking.spotId, {
        include: [{
            model: Booking
        }]
    });

    const prevBookings = spot.Bookings;
    // for each existing booking
    let bookingErr = {};
    let errors = {};
    prevBookings.forEach((booking) => {
        if (booking.id != req.params.bookingId) {

        let start = booking.startDate;
         start = new Date(start).getTime();
         // console.log(start);
         let end = booking.endDate;
         end = new Date(end).getTime();
          let st = new Date(startDate).getTime();
          // console.log(st);
          let en = new Date(endDate).getTime();

         // check start conflict
          if (st >= start && st <= end) {
            //  console.log(" start date conflict recognized! ");
             errors.startDate = "Start date conflicts with an existing booking";
             bookingErr.errors = errors;
             bookingErr.status = 403;
             bookingErr.message = "Sorry, this spot is already booked for the specified dates"
        }
        // check end conflict
           if (en >= start && en <= end) {
            //   console.log(" end date conflict recognized! ");
               errors.endDate = "End date conflicts with an existing booking";
               bookingErr.errors = errors;
               bookingErr.status = 403;
               bookingErr.message = "Sorry, this spot is already booked for the specified dates";
            }
        // check for 'sorrounding' dates
            if (st <= start && en >= end) {
                errors.startDate = "Start date conflicts with an existing booking";
                bookingErr.errors = errors;
                bookingErr.status = 403;
                bookingErr.message = "Sorry, the specified dates surround an existing booking"
            }


      if (bookingErr.status === 403) {
        const err = new Error();
        err.errors = bookingErr.errors;
        err.status = bookingErr.status;
        err.message = bookingErr.message;
        return next(err);
      };
     }
    });



    // handle past end date
    let now = Date.now();
    let endd = new Date(endDate);
    endd = endd.getTime();
    if (now > endd) {
        const err = new Error();
        err.status = 403;
        err.message = "Past bookings can't be motified";
        return next(err);
    };

    // edit the booking baby !
    startingDay = new Date(startDate);
    startingDay = startingDay.toDateString();
    endingDay = new Date(endDate);
    endingDay = endingDay.toDateString();

    console.log(startingDay);
    console.log(endingDay);

    // console.log(booking);
    booking.dataValues.startDate = startingDay;
    booking.dataValues.endDate = endingDay;
    booking.save();

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


    res.json(booking);
})


// DELETE A BOOKING

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const booking = Booking.findByPk(req.params.bookingId);
    if (!booking) {
        const err = new Error;
        err.status = 404;
        err.message = "Booking couldn't be found";
        return next(err);
    }
    const { user } = req;
    if (booking.userId != user.id) {
        const err = new Error();
        err.status = 403;
        err.message = "You are not authorized to delete this booking";
        return next(err);
    }
    booking.destroy();
    res.json({ "message": "Successfully deleted"});

})

module.exports = router;
