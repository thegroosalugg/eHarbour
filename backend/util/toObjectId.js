const mongoose = require('mongoose');

exports.toObjectId = (id) => new mongoose.Types.ObjectId(String(id));
