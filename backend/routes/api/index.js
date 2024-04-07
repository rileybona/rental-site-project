// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const spotsImagesRouter = require('./spot-images.js');
const reviewsImagesRouter = require('./review-images.js');
const reviewsRouter = require('./reviews.js');

const { restoreUser } = require('../../utils/auth.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/spots', spotsRouter);

router.use('/spot-images', spotsImagesRouter);

router.use('/review-images', reviewsImagesRouter);

router.use('/reviews', reviewsRouter); 

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});


module.exports = router;
