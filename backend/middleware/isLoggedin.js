const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'invalid token' });
  }
  next();
};

module.exports = isLoggedIn;
