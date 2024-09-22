const Listing = require('../models/listing');
const { formatListing } = require('../util/formatListing')

// '/listings'
exports.getListings = (req, res, next) => {
  let query = Listing.find();

  if (req.user) {
    query = query.populate('userId', 'username');
  }

  query.then((listings) => {
    const formattedListings = listings.map(listing => formatListing(listing));
    res.status(200).json(formattedListings);
  })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// '/listing/:listingId'
exports.getListingById = (req, res, next) => {
  const id = req.params.listingId;
  let query = Listing.findById(id);

  if (req.user) {
    query = query.populate('userId', 'username');
  }

  query.then((listing) => {
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    res.status(200).json({ ...formatListing(listing), isLoggedIn: req.user?._id });
  })
    .catch((err) => {
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
