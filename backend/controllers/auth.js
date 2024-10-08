const   mongoose = require('mongoose');
const     bcrypt = require('bcrypt');
const        jwt = require('jsonwebtoken');
const saltRounds = 10;

const    User = require('../models/user');
const Listing = require('../models/listing');

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email.trim() })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ email: 'invalid' });
      }

      const { _id, email, username, password: hashedPassword } = user;
      bcrypt.compare(password, hashedPassword, (err, result) => {
        if (err) {
          return res.status(500).json({ ...err, message: 'bcrypt error' });
        }
        if (!result) {
          return res.status(401).json({ password: 'invalid' });
        }

        Listing.find({ userId: _id })
          .then((listings) => {
            const token = jwt.sign(
              { _id, email, username, listings },
              process.env.JWT_SECRET,
              { expiresIn: '30d' }
            );

            res.status(200).json({ _id, email, username, listings, token });
          })
      });
    })
    .catch((err) => {
      res.status(500).json({ ...err, message: 'last catch block error' });
    });
};

exports.postSignup = (req, res, next) => {
  const { username, email, password } = req.body;

  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      const user = new User({ username, email, password: hashedPassword });
      return user.save();
    })
    .then((user) => {
      const { _id, username, email } = user;
      const token = jwt.sign(
        { _id, email, username, listings: [] },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      res.status(200).json({ _id, email, username, listings: [], token });
    })
    .catch((err) => {
      let errors = err;
      if (err.keyPattern) {
        const entry = Object.keys(err.keyPattern)[0]; // converts mongoose code 11000 errors to frontend friendly format
        errors = { [entry]: 'exists' };
      }
      res.status(400).json(errors);
    });
};
