const fs = require('fs');

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(403).json({ message: 'user logged out' });
  }
  next();
};

module.exports = isLoggedIn;
