const   mongoose = require('mongoose');
const       Chat = require('../models/chat');
const toObjectId = (id) => new mongoose.Types.ObjectId(String(id));

// chat
exports.postChat = (req, res, next) => {
  const          { _id, username, email } = req.user;
  const   user = { _id, username, email };
  const seller = {
    ...req.body.seller,
    _id: toObjectId(req.body.seller._id), // Convert to ObjectId
    listing: {
      ...req.body.seller.listing,
      _id: toObjectId(req.body.seller.listing._id),
    },
  };
  const newChat = new Chat({
    members: [user, seller],
  });

  newChat
    .save()
    .then((newChat) => {
      res.status(200).json(newChat);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// chats
exports.getChats = (req, res, next) => {
  const { _id } = req.user;

  Chat.find({
    members: { $elemMatch: { _id } },
  })
    .sort({ createdAt: -1 })
    .then((chats) => {
      const chatsWithSessionId = chats.map((chat) => ({
        ...chat._doc,
        sessionId: _id,
      }));
      res.status(200).json(chatsWithSessionId);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

// /chat/:sellerId/:listingId
exports.findChat = (req, res, next) => {
  const userId = req.user._id;
  const { sellerId, listingId } = req.params;

  Chat.findOne({
    members: {
      $all: [
        { $elemMatch: { _id: userId } },
        { $elemMatch: { _id: toObjectId(sellerId), 'listing._id': toObjectId(listingId) } },
      ],
    },
  })
    .then((chat) => {
      if (chat) {
        res.status(200).json(chat);
      } else {
        res.status(404).json({ message: 'Chat not found' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};
