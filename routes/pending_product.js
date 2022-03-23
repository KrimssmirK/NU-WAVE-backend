const { Router } = require('express');
const pending_productController = require('../controllers/pending_productController');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get('/pending_product/:iId', pending_productController.get_pending_product);
router.post('/pending_product/:iId/:eId', pending_productController.upload.single('image'), pending_productController.add_pending_product);
// router.delete('/pending_product/:ppId', pending_productController.delete_pending_product);

module.exports = router;

// ppId -> pending product ID
// iId -> innovator ID
// eId -> exhibit ID