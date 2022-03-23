const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ExhibitSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});

module.exports = Exhibit = mongoose.model('exhibit', ExhibitSchema);