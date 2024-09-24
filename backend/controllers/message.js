const mongoose = require('mongoose');
const  Message = require('../models/message');

exports.postMessage = (req, res, next) => {
  const { text, chatId } = req.body;
  const userId = req.user._id;

  if (!text.trim()) {
    return res.status(400).json({ message: 'Message empty' });
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
