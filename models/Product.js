const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ProductSchema = new Schema({
  rank: {
    type: Number
  },
  winners_name: {
    type: String,
    default: ''
  },
  product_name: {
    type: String,
    default: ''
  },
  number_of_members: {
    type: Number,
    default: 0
  },
  members: [{member: String}],
  intellectual_property: {
    type: String,
    default: ''
  },
  social_impact: {
    type: String,
    default: ''
  },
  output: {
    type: String,
    default: ''
  },
  mentors: {
    type: String,
    default: ''
  },
  mentors_email_address: {
    type: String,
  },
  mentors_name_who_received_the_email: {
    type: String,
  },
  faculty_in_charge: {
    type: String,
    default: ''
  },
  campus: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  statement_of_the_value_proposition: {
    type: String,
    default: ''
  },
  images: [{
    image: {
      data: Buffer,
      contentType: String
    },
  }],
  no_of_views: {
    type: Number,
    default: 0
  },
  no_of_likes: {
    type: Number,
    min: [0, "Value must be greater than 0"],
    default: 0,
  },
  ratings: {
    type: Number,
    min: 0.0,
    max: 5.0,
    default: 0.0
  },
  total_rate: {
    type: Number,
    default: 0
  },
  count_rate_clicked: {
    type: Number,
    default: 0,
  },
  exhibit_name: {
    type: String,
    required: true
  },
 
})

module.exports = Product = mongoose.model('product', ProductSchema)