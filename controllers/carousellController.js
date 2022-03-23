const Product = require('../models/Product');

module.exports.get_top_five_carousell = (req, res) => {
  Product.find({}).sort('rank').limit(5)
  .then(carousells => {
    res.send(carousells);
  })
  .catch(err => console.log(err));
};

module.exports.update_carousell = (req, res) => {
//    do something
};