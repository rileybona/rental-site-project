const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');

const { Spot } = require('../../db/models');


// GET ALL SPOTS
router.get('/', async (req, res) => {
    const spots = await Spot.findAll({
        include: [{
            model: Review,
        }, {
            model: SpotImage,
        }],
    });

    

    spots.forEach((Spot) => {
        // create avgRating attribute for each spot
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

        // create previewImage attribute for each spot
        let imgArray = Spot.dataValues.SpotImages;
        delete Spot.dataValues.SpotImages;
        console.log(imgArray);
        // set a default image
        Spot.dataValues.previewImage = 'https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=800';

        // iterate through images, if one is preview, set preview to that image
        imgArray.forEach((SpotImage) => {
            if (SpotImage.dataValues.preview === true) {
                console.log("its happening, folks!");
                Spot.dataValues.previewImage = SpotImage.dataValues.url;
            }
        });
    });

    res.json(spots);
})




module.exports = router;
