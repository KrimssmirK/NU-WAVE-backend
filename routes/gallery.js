const { Router } = require('express')
const productController = require('../controllers/galleryController')
const router = Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/gallery/upload', galleryController.get_upload_gallery_page)

module.exports = router