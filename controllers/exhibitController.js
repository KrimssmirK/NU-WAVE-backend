const Exhibit = require('../models/Exhibit');
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

module.exports.get_upload_exhibit_page = async (req, res) => {
  res.render('temp/uploadExhibitPage');
}

module.exports.get_exhibits = async (req, res) => {
  const exhibits = []
  const cursor = Exhibit.find({}).lean().cursor()
  cursor.on('data', exhibit => {
    const currentExhibit = {
      id: exhibit._id,
      title: exhibit.title,
      description: exhibit.description
    }
    exhibits.push(currentExhibit)
  })
  cursor.on('end', () => res.send(exhibits))
}

module.exports.get_exhibit_image = (req, res) => {
  const query = req.params
  Exhibit.findOne(query)
  .then(exhibit => {
    const image = {
      contentType: exhibit.image.contentType,
      data: exhibit.image.data.toString('base64')
    }
    res.send(image)
  })
  .catch(error => console.log(error))
}

module.exports.get_specific_exhibit = async (req, res) => {
  const query = req.params
  console.log(query)
  await Exhibit.findOne(query)
  .then(exhibit => {
    res.send(exhibit)
  })
  .catch(err => {
    res.status(500).send('An error occurred', err);
  })
}

module.exports.add_exhibit = async (req, res) => {
  const { title, description } = req.body;
  const imagePath = path.join(__dirname + '/../' + 'uploads/' + req.file.filename);
  const newExhibit = new Exhibit({
    title: title,
    description: description,
    image: {
      data: fs.readFileSync(imagePath),
      contentType: 'image/png'
    }
  });
  await newExhibit.save()
  .then(exhibit => {
    res.send('success uploading new exhibit');
    fs.unlink(imagePath, (err) => {
      if (err) console.log(err);
      console.log(`${imagePath} successfully deleted`);
    });
  })
  .catch(err => res.send(err));
};


