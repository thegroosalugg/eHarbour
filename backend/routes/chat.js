const express = require('express');

const chatController = require('../controllers/chat');

const router = express.Router();

router.post('/chat', chatController.postChat);
router.get('/chats/', chatController.getChats);
router.get('/chat/:sellerId/:listingId', chatController.findChat)


module.exports = router;
