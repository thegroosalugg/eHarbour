const Listing = require('../models/listing');

// '/listings
exports.getListings = (req, res, next) => {
  Listing.find()
    .populate('userId', 'username')
    .then((listings) => {
      res.status(200).json(listings);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// '/listing/:listingId'
exports.getListingById = (req, res, next) => {
  const id = req.params.listingId;

  Listing.findById(id)
    .populate('userId', 'username')
    .then((listing) => {
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }

      res.status(200).json(listing);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ ...err, message: 'getListingById Error' });
    });
};

// view json on http://localhost:3000/
exports.getIndex = (req, res, next) => {
  Listing.find()
    .then((listings) => {
      res.status(200).json(listings);
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
};
