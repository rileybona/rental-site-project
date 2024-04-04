const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth')
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

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
        // console.log(imgArray);
        // set a default image
        Spot.dataValues.previewImage = 'https://images.pexels.com/photos/101808/pexels-photo-101808.jpeg?auto=compress&cs=tinysrgb&w=800';

        // iterate through images, if one is preview, set preview to that image
        imgArray.forEach((SpotImage) => {
            if (SpotImage.dataValues.preview === true) {
                // console.log("its happening, folks!");
                Spot.dataValues.previewImage = SpotImage.dataValues.url;
            }
        });
    });

    res.json(spots);
});



// CREATE A SPOT

const validateSpotPost = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid address'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isAlpha()
        .withMessage('Please provide a valid city'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isAlpha()
        .withMessage('Please provide a valid state'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid country'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat()
        .withMessage('Please provide a valid latitude'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat()
        .withMessage('Please provide a valid longitude'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid name.'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid description'),
    check('price')
        .exists({ checkFalsy: true })
        .isFloat( { min: 1} )
        .withMessage('Please provide a valid price'),
    handleValidationErrors
];

router.post('/', requireAuth, validateSpotPost, async (req, res) => {
    const { user } = req;
    const ownerId = user.id;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    res.json(spot);
});





module.exports = router;
