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
    // console.log(reviews);
    Response.Reviews = reviews;
    // console.log(Response);

    res.json(Response);
});


// ADD IMAGE TO A REVIEW BY REVIEW ID

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId, {
        include: [{
            model: ReviewImage
        }]
    });

    // ensure review exists 404
    if (!review) {
        const err = new Error;
        err.status = 404;
        err.message = "Review couldn't be found";
        return next(err);
    };

    // ensure current user owns this review
    const { user } = req;
    if (review.userId != user.id) {
        const err = new Error;
        err.status = 403;
        err.message = "You are not authorized to edit this review";
        return next(err);
    };

    // ensure the review does not have max 10 images 403
    const imageCount = review.ReviewImages.length;
    // console.log(imageCount);
    if (imageCount >= 10) {
        const err = new Error;
        err.status = 403;
        err.message = "Maximum number of images for this resources was reached";
        return next(err);
    }

    // if no errors, add the image !
    const { url } = req.body;
    const img = await ReviewImage.create({
        reviewId: review.id,
        url: url
    });

    const cleanImg = {};
    cleanImg.id = img.id;
    cleanImg.url = img.url;

    res.json(cleanImg);

});

// EDIT A REVIEW

const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .isInt()
        .custom((value) => {
            return (value >= 1 && value <= 5);
        })
        .withMessage('Stars must be an integer between 1 and 5'),
    handleValidationErrors
]

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    // find the review
    const theReview = await Review.findByPk(req.params.reviewId);

    // create error if it does not exist
    if (!theReview) {
        const err = new Error;
        err.status = 404;
        err.message = "Review couldn't be found";
        return next(err);
    };

    // create error if current user does not own this review
    const { user } = req;
    if (theReview.userId != user.id) {
        const err = new Error;
        err.status = 403;
        err.message = "You are not authorized to edit this review";
        return next(err);
    }

    // update the review object and save.
    const { review, stars } = req.body;

    theReview.review = review;
    theReview.stars = stars;
    theReview.save();

    // return the review object
    res.json(theReview);
});


// DELETE A REVIEW

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    // get the review
    const review = await Review.findByPk(req.params.reviewId);

    // create error if there is no such review
    if (!review) {
        const err = new Error;
        err.status = 404;
        err.message = "Review couldn't be found";
        return next(err);
    }

    // create error if current user does not own this review
    const { user } = req;
    if (review.userId != user.id) {
        const err = new Error;
        err.status = 403;
        err.message = "You are not authorized to delete this review";
        return next(err);
    }

    // else destroy the review
    review.destroy();

    // return a success message
    res.json({ "message": "Successfully deleted" });
});


module.exports = router;
