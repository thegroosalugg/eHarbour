const express = require('express');

const chatController = require('../controllers/conversation'); // *REMINDER*

const router = express.Router();

router.post('/chat', chatController.postChat);
router.get('/chats/', chatController.getChats);
router.get('/chat/:sellerId/:productId', chatController.findChat)


module.exports = router;
