const      mongoose     = require('mongoose');
const            fs     = require('fs');
const    fileHelper     = require('../util/file');
const          User     = require('../models/user');
const       Listing     = require('../models/listing');
const {    trimBody   } = require('../util/trimBody');
const { formatListing } = require('../util/formatListing')

// all controllers will return 403 if req.user is undefined in isLoggedIn middleWare supplied in /routes

// '/add-listing'
exports.postAddListing = (req, res, next) => {
  const { title, price, description } = trimBody(req.body);
  const userId   = req.user._id;
  const imageUrl = req.file?.path;

  const listing = new Listing({ title, price, description, imageUrl, userId });
  listing
    .save()
    .then((listing) => {
      res.status(200).json(listing);
    })
    .catch((err) => {
      if (req.file) {
        fs.unlinkSync(req.file.path); // Remove the uploaded file if form validation fails
      }
      let errors = {};
      for (key in err.errors) { // converts mongoose errors into more easily consumable frontend object
        errors[key] = err.errors[key].kind === 'Number' ? 'non-numeric' : err.errors[key].kind;
      }
      res.status(400).json(errors);
    });
};

// '/user-listings'
exports.getUserListings = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      Listing.find({ userId: req.user._id })
        .then((listings) => {
          const { _id, username, email } = user;
          res.status(200).json({ listings, _id, username, email });
        })
        .catch((err) => {
          res.status(500).json({ ...err, message: 'user-listings: Listind.find failed' });
        });
    })
    .catch((err) => {
      res.status(500).json({ ...err, message: 'user-listings: User.findById failed' });
    });
};

// '/edit-listing/:listingId'
exports.putEditListing = (req, res, next) => {
  const id = req.params.listingId;
  const { title, price, description } = trimBody(req.body);
  const imageUrl = req.file?.path;

  Listing.findById(id).then(async (listing) => {
    const oldImageUrl = listing.imageUrl;

    try {
      await listing
        .updateOne({ $set: { title, price, description, imageUrl } }, { runValidators: true })
        .exec();
      if (imageUrl && oldImageUrl !== imageUrl) {
        fs.unlinkSync(oldImageUrl);
      }
      const listing_1 = await Listing.findById(id).populate('userId', 'username');
      res.status(200).json({ ...formatListing(listing_1), isLoggedIn: req.user?._id });
    } catch (err) {
      if (imageUrl) {
        fs.unlinkSync(imageUrl);
      }
      let errors = {};
      for (key in err.errors) { // converts mongoose errors into more easily consumable frontend object
        errors[key] = err.errors[key].kind;
      }
      if (err.kind === 'Number') { // alternate err object structure to POST if price is not a number
        errors.price = 'non-numeric';
      }
      res.status(400).json(errors);
    }
  });
};

// '/delete-listing/:listingId'
exports.deleteListing = (req, res, next) => {
  const id = req.params.listingId;

  Listing.findById(id)
    .then((listing) => {
      fileHelper.deleteFile(listing.imageUrl);
      return Listing.deleteOne({ _id: id, userId: req.user._id });
    })
    .then(() => {
      res.status(200).json(null); // must be empty for frontend response
    })
    .catch((err) => {
      res.status(500).json({ ...err, message: 'delete listing error' });
    });
};
