const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PendingProductSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  price: {
    type: Number
  },
  main_image: {
    data: Buffer,
    contentType: String
  },
  sub_images: [{
    sub_image: {
      data: Buffer,
      contentType: String
    }
  }],
  no_of_likes: {
    type: Number,
    default: 0
  },
  no_of_views: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Number,
    min: 0.0,
    max: 5.0,
    default: 0.0
  },
  innovatorId: {
    type: String,
    required: true
  },
  exhibitId: {
    type: String,
    required: true
  }
});

module.exports = PendingProduct = mongoose.model('pending_product', PendingProductSchema);