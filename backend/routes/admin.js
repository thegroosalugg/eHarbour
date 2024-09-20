const         express = require('express');
const adminController = require('../controllers/admin');
const          router = express.Router();
const      isLoggedIn = require('../middleware/isLoggedin')

router.post('/add-listing',                 isLoggedIn, adminController.postAddListing);
router.get('/user-listings',                isLoggedIn, adminController.getListings);
router.put('/edit-listing/:listingId',      isLoggedIn, adminController.putEditListing);
router.delete('/delete-listing/:listingId', isLoggedIn, adminController.deleteListing);

module.exports = router;
