const         express = require('express');
const adminController = require('../controllers/admin');
const          router = express.Router();

router.post('/add-listing',                 adminController.postAddListing);
router.get('/user-listings',                adminController.getUserListings);
router.put('/edit-listing/:listingId',      adminController.putEditListing);
router.delete('/delete-listing/:listingId', adminController.deleteListing);

module.exports = router;
