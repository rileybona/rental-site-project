const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');


const { Spot } = require('../../db/models');


// GET ALL SPOTS
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: 'Reviews'
    });

    console.log(spots);

    spots.forEach((Spot) => {
        let revArray = Spot.dataValues.Reviews;
        delete Spot.dataValues.Reviews;
        if (revArray.length === 0) {
            Spot.dataValues.avgRating = "This spot has no reviews yet.";
        } else {
            let sum = 0;
            revArray.forEach((rev) => { sum += rev.stars });
            let avg = ( sum / revArray.length);
            Spot.dataValues.avgRating = avg;
        }
    });

    res.json(spots);
})




module.exports = router;
