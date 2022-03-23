const { Router } = require('express');
const adminController = require('../controllers/adminController');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// VIEWS (4)
router.get('/signup', adminController.get_signup_page);
router.get('/login', adminController.get_login_page);
router.get('/approval', adminController.get_approval_page);


// API
router.post('/signup', adminController.signup);
router.post('/login', adminController.login);
// router.get('/admin', adminController.admin);

module.exports = router;