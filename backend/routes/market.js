const          express = require('express');
const marketController = require('../controllers/market');
const           router = express.Router();

router.get('/',                   marketController.getIndex);
router.get('/listings',           marketController.getListings);
router.get('/listing/:listingId', marketController.getListingById);

module.exports = router;
