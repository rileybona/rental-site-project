const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth')

const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');
const { ReviewImage } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

// helper func to find avg rating
function setAvgStars(Spot) {
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
};
// helper func to find preview image
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
        setAvgStars(Spot);

        // create previewImage attribute for each spot
        setPreviewImage(Spot);
    });

    res.json(spots);
});


// GET SPOTS BY CURRENT USER

router.get('/current', requireAuth, async (req, res) => {
    // get current user
    const { user } = req;
    const thisOwnerId = user.id;


    // get spots & associate reviews & associated images
    const spots = await Spot.findAll({
        where: {
            ownerId: thisOwnerId
        },
        include: [{
            model: Review,
        }, {
            model: SpotImage,
        }],
    });

    // if there are no spots under this user, return an appropriate response
    if (spots.length === 0) {
        return res.json({ "message": "You have not posted any spots yet !" });
    };

    // otherwise, set the avg rating and preview image of each spot
    spots.forEach((Spot) => {
        setAvgStars(Spot);
        setPreviewImage(Spot);
    });

    // return the user's spots !
    res.json(spots);
});

// GET A SPOT BY SPOT ID

router.get('/:spotId', async (req, res, next) => {
    // get the spot, henny
    const thisSpot = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [{
            model: Review,
        }, {
            model: SpotImage,
            attributes: {
                exclude: ['spotId', 'createdAt', 'updatedAt']
            }
         }, {
            model: User, as: "Owner"
         }],
    });

    // generate an error if there's no spot with this id
    if (!thisSpot) {
        const err = new Error;
        err.status = 404;
        err.message = "No spot exists with the provided id";
        next(err);
    };

    // create a numReviews variable
    let reviews = thisSpot.Reviews;
    let numReviews = reviews.length;

    // calculate average rating of reviews
    let reviewTotalStars = reviews.reduce((total, review) => total + review.stars, 0);
    let avgStarRating = reviewTotalStars / numReviews;
    // edge case for 0 reviews
    if (numReviews === 0) {
        avgStarRating = "This spot has no reviews yet."
    };

    // remove the reviews array
    delete thisSpot.dataValues.Reviews;

    // clean up user response object
    const spotOwner = thisSpot.Owner;
    const cleanOwner = {
        id: spotOwner.id,
        firstName: spotOwner.firstName,
        lastName: spotOwner.lastName,
    }
    thisSpot.dataValues.Owner = cleanOwner;


    // send the response object
    res.json({
        numReviews,
        avgStarRating,
        ...thisSpot.toJSON()
    });

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
        .withMessage('Please provide a valid city'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid state'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Please provide a valid country'),
    check('lat')
        .exists({ checkFalsy: true })
        .isFloat()
        .custom((value) => {
            return (value > -90 && value < 90)
        })
        .withMessage('Latitude must be within -90 and 90'),
    check('lng')
        .exists({ checkFalsy: true })
        .isFloat()
        .custom((value) => {
            return (value > -180 && value < 180)
        })
        .withMessage('Longitude must be within -180 and 180'),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
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

    res.status(201);
    res.json(spot);
});



// EDIT A SPOT

router.put('/:spotId', requireAuth, validateSpotPost, async (req, res, next) => {
    // find the spot in question
    const spot = await Spot.findByPk(req.params.spotId);
    // console.log(spot);

    // generate 404 if there is no such spot
    if (!spot) {
        const err = new Error;
        err.status = 404;
        err.message = "there is no such spot!";
        return next(err);
    }

    // generate an error if user does not own this spot
    const { user } = req;
    if (spot.ownerId != user.id) {
        const err = new Error;
        err.status = 401;
        err.message = "You are not authorized to edit this spot.";
        return next(err);
    }

    // otherwise, edit the spot !
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    await spot.save();

    res.json(spot);
});



// ADD IMAGE TO SPOT BY SPOT ID

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
     // find the spot in question
     const spot = await Spot.findByPk(req.params.spotId);
    //  console.log(spot);

     // generate 404 if there is no such spot
     if (!spot) {
         const err = new Error;
         err.status = 404;
         err.message = "there is no such spot!";
         return next(err);
     }

     // generate an error if user does not own this spot
     const { user } = req;
     if (spot.ownerId != user.id) {
         const err = new Error;
         err.status = 401;
         err.message = "You are not authorized to edit this spot.";
         return next(err);
     }

     // otherwise, add image to this spot
     const { url, preview } = req.body;
     const spotId = spot.id;

     const image = await SpotImage.create({ spotId, url, preview });

     console.log(image);

     const cleanImage = {
        id: image.id,
        url: image.url,
        preview: image.preview
     };

     res.json(cleanImage);
});


// DELETE A SPOT

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    // find the spot in question
      const spot = await Spot.findByPk(req.params.spotId);
      //  console.log(spot);

    // generate 404 if there is no such spot
       if (!spot) {
           const err = new Error;
           err.status = 404;
           err.message = "there is no such spot!";
           return next(err);
       }

    // generate an error if user does not own this spot
       const { user } = req;
       if (spot.ownerId != user.id) {
           const err = new Error;
           err.status = 401;
           err.message = "You are not authorized to delete this spot.";
           return next(err);
       }

    // otherwise delete the spot
       spot.destroy();

    // response
    res.json({ "message": "successfully deleted."});

})


// GET ALL REVIEWS BY SPOT ID

router.get('/:spotId/reviews', async (req, res, next) => {
    // pull reviews w user & review images
    const reviews = await Review.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: [{
            model: User
        }, {
            model: ReviewImage
        }]
    });

    // create an error if there is no spot at this id
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) {
        const err = new Error;
        err.status = 404;
        err.message = "Spot couldn't be found!";
        return next(err);
    };

    // return a message if there are no reviews yet
    if (!reviews) {
        return res.json({ "message": "This spot has no reviews yet!" });
    }

    // for each review ...
    reviews.forEach((review) => {
        // add user response format logic
        const user = {};
        user.id = review.User.id,
        user.firstName = review.User.firstName,
        user.lastName = review.User.lastName

        delete review.dataValues.User;
        // console.log(review);
        review.dataValues.User = user;

        // delete & re add review image data to send to bottom of response object
        const revImgs = review.ReviewImages;
        delete review.dataValues.ReviewImages;
        review.dataValues.ReviewImages = revImgs;
    });

    // add array to a response object and res.json
    const Response = {};
    Response.Reviews = reviews;
    res.json(Response);
});


// CREATE REVIEW FOR A SPOT BY SPOT ID

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

router.post('/:spotId/reviews', validateReview, requireAuth, async (req, res, next) => {
    // find spot
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [{
            model: Review
        }]
    });
    // create error if there is not spot with that id
    if (!spot) {
        const err = new Error;
        err.status = 404;
        err.message = "Spot couldn't be found";
        return next(err);
    };

    // create an error if this user has already made a review for this spot
    const { user } = req;
    const userId = user.id;

    spot.Reviews.forEach((review) => {
        if (review.userId == user.id) {
            const err = new Error;
            err.status = 403;
            err.message = "User already has a review for this spot"
            return next(err);
        }
    });

    //otherwise, create the spot

    const spotId = parseInt(req.params.spotId);
    const { review, stars } = req.body;

    const newReview = await Review.create({ spotId, userId, review, stars });

    res.status(201);
    return res.json(newReview);
});

module.exports = router;
