const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth')

const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models');
const { Spot } = require('../../db/models');
const { User } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');


// DELETE AN IMAGE FOR A SPOT

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    // find the spot image
    const spotImage = await SpotImage.findByPk(req.params.imageId);
    // create an error if there is no such spot image
    if (!spotImage) {
        const err = new Error;
        err.status = 404;
        err.message = "Spot Image couldn't be found";
        return next(err);
    }
    // create an error if the current user does not own this spot
    const { user } = req;
    // console.log(user.id);
    const spot = await Spot.findByPk(spotImage.spotId);
    // console.log(spot.ownerId);

    if ( user.id != spot.ownerId) {
        const err = new Error;
        err.status = 403;
        err.message = "You are not authorized to delete this image";
        return next(err);
    };

    // delete this spot image
    spotImage.destroy();
    res.status(200);
    res.json({ "message": "Successfully deleted" });
});



module.exports = router;
