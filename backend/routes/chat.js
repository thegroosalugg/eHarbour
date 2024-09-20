const        express = require('express');
const chatController = require('../controllers/chat');
const     isLoggedIn = require('../middleware/isLoggedin');
const         router = express.Router();

router.post('/chat',                     isLoggedIn, chatController.postChat);
router.get('/chats/',                    isLoggedIn, chatController.getChats);
router.get('/chat/:sellerId/:listingId', isLoggedIn, chatController.findChat);

module.exports = router;
