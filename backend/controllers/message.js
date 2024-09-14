const mongoose = require('mongoose');
const Message = require('../models/message');

exports.postMessage = (req, res, next) => {
  const { text, chatId } = req.body;
  const userId = req.session.user?._id;

  const errors = {};
  if (!text.trim()) errors.text   = 'Message empty';
  if (!chatId)      errors.chatId = 'Cannot find chat';
  if (!userId)      errors.userId = 'No user logged in';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ ...errors });
  }

  const newMessage = new Message({ text, userId, chatId });

  newMessage.save()
    .then(message => {
      res.status(201).json(message);
    })
    .catch(err => {
      res.status(500).json({ ...err, message: 'message sending failed' });
    });
};

exports.getMessages = (req, res, next) => {
  Message.find({ chatId: req.params.chatId })
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch(err => {
    res.status(500).json({ ...err, message: 'failed to fetch messages' });
  })
};
