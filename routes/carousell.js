const { Router } = require('express');
const carousellController = require('../controllers/carousellController');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/carousell', carousellController.get_top_five_carousell);

module.exports = router;