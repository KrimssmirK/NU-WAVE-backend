const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GuestSchema = new Schema({
  ip: String,
  liked_products: [String],
  rated_products: [String],
  seen_products: [String],
  gadget: String,
});

module.exports = Guest = mongoose.model('guest', GuestSchema);