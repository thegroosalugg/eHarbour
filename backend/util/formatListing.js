exports.formatListing = (listing) => {
  return {
    ...listing._doc,
    username: listing.userId?.username,
      userId: listing.userId?._id || listing.userId,
  };
}
