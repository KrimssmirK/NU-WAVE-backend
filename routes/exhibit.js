const { Router } = require('express');
const exhibitController = require('../controllers/exhibitController');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/exhibit/upload', exhibitController.get_upload_exhibit_page);
router.post('/exhibit', exhibitController.upload.single('image'), exhibitController.add_exhibit);

// this is used in exhibits.html in Exhibit.js component
router.get('/exhibits', exhibitController.get_exhibits)
router.get('/exhibit/image/:_id', exhibitController.get_exhibit_image)
router.get('/exhibit/:title', exhibitController.get_specific_exhibit);

module.exports = router;





