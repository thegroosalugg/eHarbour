const Listing = require('../models/listing');

// '/listings'
exports.getListings = (req, res, next) => {
  let query = Listing.find();

  if (req.user) {
    query = query.populate('userId', 'username');
  }

  query.then((listings) => {
    const transformedListings = listings.map(listing => ({
      ...listing._doc,
      username: listing.userId?.username,
      userId: listing.userId?._id || listing.userId,
    }));
    res.status(200).json(transformedListings);
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
