const           express = require('express');
const messageController = require('../controllers/message');
const        isLoggedIn = require('../middleware/isLoggedin');
const            router = express.Router();

router.post('/message',         isLoggedIn, messageController.postMessage);
router.get('/messages/:chatId', isLoggedIn, messageController.getMessages);

module.exports = router;
