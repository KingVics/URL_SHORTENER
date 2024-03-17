const mongoose = require('mongoose');

const UrlModel = new mongoose.Schema({
  original_url: {
    type: String,
    required: [true, 'provide url'],
    unqiue: true,
  },
  short_url: Number,
});

module.exports = mongoose.model('UrlModel', UrlModel);
