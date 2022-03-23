const PendingProduct = require('../models/PendingProduct');
const Exhibit = require('../models/Exhibit');
const Innovator = require('../models/Innovator');
const fs = require('fs');
const path = require('path');

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

module.exports.get_pending_product = async (req, res) => {
  const innovatorId = req.params.iId;
  PendingProduct.find({innovatorId: innovatorId})
  .then(pending_products => {
    res.send(pending_products);
  })
  .catch(err => {
    res.status(500).send('Something went wrong');
  });
};

module.exports.add_pending_product = async (req, res) => {
  const innovatorId = req.params.iId;
  const exhibitId = req.params.eId;
  const { title, description, price } = req.body;
  const mainImagePath = path.join(__dirname + '/../' + 'uploads/' + req.file.filename);
  // const sub_images;
  const details = {
    title: title,
    description: description,
    price: price,
    main_image: {
      data: fs.readFileSync(mainImagePath),
      contentType: 'image/png'
    },
    // sub_images: sub_images,
    innovatorId: innovatorId,
    exhibitId: exhibitId
  };
  fs.unlink(mainImagePath, (err) => {
    if (err) console.log(err);
    console.log(`${mainImagePath} successfully deleted`);
  });
  newPendingProduct = new PendingProduct(details);
  await newPendingProduct.save()
  .then(pending_product => {
    const pendingDetails = {
      title: pending_product.title,
      description: pending_product.description,
      price: pending_product.price
    };
    res.send(pendingDetails);
  })
  .catch(err => {
    res.status(500).send('Something went wrong');
  });
};

module.exports.delete_pending_product = async (req, res) => {
// do something
};