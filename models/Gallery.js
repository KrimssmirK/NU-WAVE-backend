const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GallerySchema = new Schema({
  title: String,
  image: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = Guest = mongoose.model('gallery', GallerySchema);