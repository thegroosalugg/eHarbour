const       jwt      = require('jsonwebtoken');
const { toObjectId } = require('../util/toObjectId');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Token expired', req.user)
      } else {
        user._id = toObjectId(user._id); // convert back to object ID
        req.user = user;
      }
    });
  }
  next();
};

module.exports = authenticateJWT;
