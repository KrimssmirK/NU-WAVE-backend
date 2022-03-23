const mongoose = require('mongoose')
const Schema = mongoose.Schema
const PurchaseSchema = Schema({
  first_name: String,
  last_name: String,
  email_address: String,
  mobile_number: String,
  product_name: String,
  mentors_email_address: String,
  mentors_name_who_received_the_email: String,
  quantity: Number,
  message: String,
  date_added: {
    type: Date,
    default: Date.now
  }
})

module.exports = Purchase = mongoose.model('purchase', PurchaseSchema)