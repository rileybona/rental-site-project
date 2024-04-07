const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth')

const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { ReviewImage } = require("../../db/models");

function setPreviewImage(Spot) {
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
};


// GET ALL REVIEWS OF THE CURRENT USER
router.get('/current', requireAuth, async (req, res, next) => {
    // find current user
    const { user } = req;

    // create a response object that contains
    const Response = {};
    // "Reviews" -- an array of review objects
    const reviews = await Review.findAll({
        where: {
            userId: user.id
        },
        include: [{
            model: User
        }, {
            model: Spot,
            include: [{
                model: SpotImage
            }]
        }, {
            model: ReviewImage,
        }]
    });

    // that each contain -- review data, User object, Spot object, ReviewImges: array of objects
    reviews.forEach((review) => {
        // adjust User object
        const uzer = {};
        uzer.id = review.User.id,
        uzer.firstName = review.User.firstName,
        uzer.lastName = review.User.lastName

        delete review.dataValues.User;
        // console.log(review);
        review.dataValues.User = uzer;

        // adjust Spot object (remove createdAt & updatedAt...
        // ...add preview image to the spot)
        setPreviewImage(review.Spot);

        const spot = {};
        spot.id = review.Spot.id;
        spot.ownerId = review.Spot.ownerId;
        spot.address = review.Spot.address;
        spot.city = review.Spot.city;
        spot.state = review.Spot.state;
        spot.country = review.Spot.country;
        spot.lat = review.Spot.lat;
        spot.lng = review.Spot.lng;
        spot.name = review.Spot.name;
        spot.price = review.Spot.price;
        // solve for preview image (see helper func)
        spot.previewImage = review.Spot.dataValues.previewImage;

        delete review.dataValues.Spot;
        review.dataValues.Spot = spot;

        // delete and re-instate review images to correct response object order
        const revImgs = review.ReviewImages;
        delete review.dataValues.ReviewImages;
        review.dataValues.ReviewImages = revImgs;
        });

    // attach reviews array to a larger response object
    console.log(reviews);
    Response.Reviews = reviews;
    console.log(Response);

    res.json(Response);
});



module.exports = router;
