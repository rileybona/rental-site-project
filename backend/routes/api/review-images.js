const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth')

const { Review } = require('../../db/models');
const { ReviewImage } = require('../../db/models');

// DELETE REVIEW IMAGE

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    // get the review image
    const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
        include: [{
            model: Review
        }]
    });

    // create an error if there is no such image
    if (!reviewImage) {
        const err = new Error;
        err.status = 404;
        err.message = "Review Image couldn't be found";
        return next(err);
    }





    // create an error if review is not owned by current user
    const { user } = req;
    const correctId = reviewImage.Review.userId;

    if (correctId != user.id) {
        const err = new Error;
        err.status = 403;
        err.message = 'You are not authorized to delete this image';
        return next(err);
    }


    // otherwise, delete the review image
    reviewImage.destroy();

    res.json({ "message": "Successfully deleted" });
})






module.exports = router;
