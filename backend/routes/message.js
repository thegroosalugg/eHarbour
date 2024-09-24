const           express = require('express');
const messageController = require('../controllers/message');
const            router = express.Router();

router.post('/message',         messageController.postMessage);
router.get('/messages/:chatId', messageController.getMessages);

module.exports = router;
