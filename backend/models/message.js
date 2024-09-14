const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId, required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, required: true
    },
    text: {
      type: String, required: true,
    },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
