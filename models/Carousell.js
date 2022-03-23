const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CarousellSchema = new Schema({
  product_id: {
    type: String,
    required: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});

module.exports = Carousell = mongoose.model('carousell', CarousellSchema);