const Product = require('../models/Product')
const Guest = require('../models/Guest')
const Purchase = require('../models/Purchase')
const fs = require('fs')
const path = require('path')

const multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});
const upload = multer({ storage: storage });

module.exports.upload = upload;

module.exports.get_upload_product_page = async (req, res) => {
  await Product.find({})
  .then(products => {
    
    res.render('temp/uploadProductPage', { product: products });
  })
  .catch(err => {
    res.status(500).send('An error occurred', err);
  });
};

module.exports.get_products = (req, res) => {
  const query = req.params
  const allProducts = []
  const cursor = Product.find(query).lean().cursor()
  cursor.on('data', function(product) {
    const targetProduct = {
      id: product._id,
      name: product.product_name,
      description: product.description,
    }
    allProducts.push(targetProduct)
  })
  cursor.on('end', function() {res.send(allProducts)})
}

module.exports.get_product_main_image = (req, res) => {
  const query = req.params
  Product.findOne(query)
  .then(product => {
    const image = {
      contentType: product.images[0].image.contentType,
      data: product.images[0].image.data.toString('base64')
    }
    res.send(image)
  })
  .catch(error => console.log(error))
}

const options = {
  upsert: true,
  new: true,
  runValidators: true,
  setDefaultsOnInsert: true
}

async function has_seen_the_product(guest_ip, product_id, callback) {
  await Guest
  .findOne({ ip: guest_ip })
  .then(guest_that_queried => {
    const index_of_the_seen_product = guest_that_queried.seen_products.indexOf(product_id)
    if (index_of_the_seen_product === -1) {
      callback(null, false)
    } else {
      callback(null, true)
    }
  })
  .catch(error => callback(error, null))
}

module.exports.get_no_of_views = async (req, res) => {
  const guest_ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const product_id = req.params._id
  has_seen_the_product(guest_ip, product_id, (error, hasSeen) => {
    if (error) console.log(error.message)
    if (!hasSeen) {
      Product.findOneAndUpdate({ _id: product_id }, { $inc: { 'no_of_views': 1 } }, options)
      .then(product => res.send({ no_of_views: product.no_of_views }))
      .catch(error => console.log(error.message))
      Guest.findOneAndUpdate({ ip: guest_ip }, { $push: { seen_products: product_id }}, options )
      .then(guest => console.log(guest.seen_products))
    } else {
      Product.findOne({ _id: product_id })
      .then(product => res.send({ no_of_views: product.no_of_views }))
      .catch(error => console.log(error.message))
      console.log('guest already seen this product')
    }
  })
}

module.exports.get_product_detail = (req, res) => {
  const query = req.params
  let specific_product = {}
  const cursor = Product
  .findOne(query)
  .lean()
  .cursor()

  cursor.on('data', product => {
    const targetProduct = {
      winners_name: product.winners_name,
      name: product.product_name,
      number_of_members: product.number_of_members,
      members: product.members,
      intellectual_property: product.intellectual_property,
      social_impact: product.social_impact,
      output: product.output,
      mentors: product.mentors,
      faculty_in_charge: product.faculty_in_charge,
      campus: product.campus,
      description: product.description,
      state_of_the_value_proposition: product.statement_of_the_value_proposition,
    }
    specific_product = targetProduct
  })
  cursor.on('end', () => res.send(specific_product))
}

module.exports.get_product_images = (req, res) => {
  const query = req.params
  let images = []
  const cursor = Product
  .findOne(query)
  .lean()
  .cursor()
  cursor.on('data', product => {
    images = product.images
  })
  cursor.on('end', () => {
    images = images.map(image => (
      {
        id: image._id,
        contentType: image.image.contentType,
        data: image.image.data.toString('base64')
      }
    ))
    res.send(images)
  })
}

async function has_rated_the_product(guest_ip, product_id, callback) {
  await Guest
  .findOne({ ip: guest_ip })
  .then(guest_that_queried => {
    const index_of_the_rated_product = guest_that_queried.rated_products.indexOf(product_id)
    if (index_of_the_rated_product === -1) {
      callback(null, false)
    } else {
      callback(null, true)
    }
  })
  .catch(error => callback(error, null))
}

module.exports.check_if_the_guest_has_rated_the_product = (req, res) => {
  const guest_ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const product_id = req.params._id
  has_rated_the_product(guest_ip, product_id, (error, hasRated) => {
    if (error) console.log(error.message)
    Product.findOne({ _id: product_id })
    .then(product => res.send({ ratings: product.ratings, hasRated: hasRated }))
  })
}

module.exports.guest_rate_the_product = async (req, res) => {
  const guest_ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const query = req.params
  const guest_rate = req.body.guest_rate
  let total_click = 0
  let total_rate = 0
  await Product
  .findOneAndUpdate(query,{ $inc: { 'total_rate': guest_rate, 'count_rate_clicked': 1 } }, options)
  .then(product => {
    total_click = product.count_rate_clicked
    total_rate = product.total_rate
  })
  .catch(error => console.log(error.message))

  const new_ratings = Math.round(total_rate / total_click)
  await Guest
  .findOneAndUpdate({ ip: guest_ip }, { $push: { rated_products: query._id }}, options)
  .then(guest_that_updated => {
  })
  .catch(error => console.log(error.message))

  await Product
  .findOneAndUpdate(query, { ratings: new_ratings }, options)
  .then(product => {
    res.send({ ratings: product.ratings, hasRated: true })
  })
  .catch(error => console.log(error.message))

  

  
}

async function has_liked_the_product(guest_ip, product_id, callback) {
  await Guest
  .findOne({ ip: guest_ip })
  .then(guest_that_queried => {
    const index_of_the_liked_product = guest_that_queried.liked_products.indexOf(product_id)
    if (index_of_the_liked_product === -1) {
      callback(null, false)
    } else {
      callback(null, true)
    }
  })
  .catch(error => callback(error, null))
}

module.exports.check_if_the_guest_has_liked_the_product = async (req, res) => {
  const guest_ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const product_id = req.params._id
  has_liked_the_product(guest_ip, product_id, (error, hasLiked) => {
    if (error) console.log(error.message)
    Product.findOne({ _id: product_id })
    .then(product => {
      res.send({ no_of_likes: product.no_of_likes, hasLiked: hasLiked })
    })
    .catch(error => console.log(error.message))
  })
}

module.exports.push_like_button = async (req, res) => {
  const guest_ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const query = req.params
  await Product
  .findOneAndUpdate(query, { $inc: { 'no_of_likes': 1 }}, options)
  .then(result => console.log('product received guest likes'))
  .catch(error => console.log(error.message))
  await Guest
  .findOneAndUpdate({ ip: guest_ip }, { $push: { liked_products: query._id }}, options)
  .then(guest_that_updated => console.log('guest liked the product'))
  .catch(error => console.log(error.message))
  res.send('like button enabled')
}

module.exports.push_unlike_button = async (req, res) => {
  const guest_ip =req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const query = req.params
  await Product
  .findOneAndUpdate(query, { $inc: { 'no_of_likes': -1 }}, options)
  .then(result => console.log('product is rejected to like'))
  .catch(error => console.log(error.message))
  await Guest
  .findOneAndUpdate({ ip: guest_ip }, { $pull: { liked_products: query._id }}, options)
  .then(guest_that_updated => console.log('guest cancelled like the product'))
  .catch(error => console.log(error.message))
  res.send('like button disabled')
}

module.exports.add_product = async (req, res) => {
  const { 
    exhibit_name,
    rank,
    winners_name,
    product_name,
    number_of_members,
    member_1,
    member_2,
    member_3,
    member_4,
    member_5,
    member_6,
    member_7,
    intellectual_property,
    social_impact,
    output,
    mentors,
    faculty_in_charge,
    campus,
    description,
    statement_of_the_value_proposition
  } = req.body;

  // creating an array of image path
  const images_path = req.files.map((file) => {
    const image_path = path.join(__dirname + '/../' + 'uploads/' + file.filename);
    return image_path;
  });

  const images_data = images_path.map(image_path => (
    { image: {data: fs.readFileSync(image_path), contentType: 'image/png'}  }
  ));
  console.log(images_data);

  const newProduct = new Product({
    exhibit_name: exhibit_name,
    rank: rank,
    winners_name: winners_name,
    product_name: product_name,
    number_of_members: number_of_members,
    members: [{member: member_1}, {member: member_2}, {member: member_3}, {member: member_4}, {member: member_5}, {member: member_6}, {member: member_7},],
    intellectual_property: intellectual_property,
    social_impact: social_impact,
    output: output,
    mentors: mentors,
    faculty_in_charge: faculty_in_charge,
    campus: campus,
    description: description,
    statement_of_the_value_proposition: statement_of_the_value_proposition,
    images: images_data
  });

  await newProduct.save()
  .then(product => {
    // console.log('product id:', product._id);
    res.send('success uploading product');
    images_path.forEach((image_path) => {
        fs.unlink(image_path, (err) => {
            if (err) console.log(err);
            console.log(`${image_path} successfully deleted`);
          });
      });
  })
  .catch(err => console.log(err));

  
}

const mail = require('./my_modules/mail')

module.exports.purchase = async (req, res) => {
  const product_id = req.params
  const form_that_entered = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email_address: req.body.email_address,
    mobile_number: req.body.mobile_number,
    quantity: req.body.quantity,
    message: req.body.message,
  }
  await Product.findOne(product_id)
  .then(product => {
    form_that_entered.product_name = product.product_name
    form_that_entered.mentors_email_address = product.mentors_email_address
    form_that_entered.mentors_name_who_received_the_email = product.mentors_name_who_received_the_email
  })
  .catch(error => console.log(error.message))

  const newPurchase = new Purchase(form_that_entered)
  await newPurchase
  .save()
  .then(purchase_that_saved => {
    console.log(purchase_that_saved)
    const gmail = mail.mailer(purchase_that_saved)
    gmail.send_email_to_buyer()
    gmail.send_email_to_seller()
  })
  .catch(error => {
    console.log(error.message)
  })
  res.redirect('/product.html')
}


