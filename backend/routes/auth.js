const express = require('express');

const authController = require('../controllers/auth');
const { validateSignup } = require('../validation/auth');

const router = express.Router();

router.post('/login', authController.postLogin);
router.post('/signup', validateSignup, authController.postSignup);

module.exports = router
