const Gallery = require('../models/Gallery') // db for gallery (title and image)

const fs = require('fs') // core node module
const path = require('path') // core node module

const multer = require('multer');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});
const upload = multer({ storage: storage })