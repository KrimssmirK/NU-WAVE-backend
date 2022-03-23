const { Router } = require('express');
const innovatorController = require('../controllers/innovatorController');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// VIEWS(6)
router.get('/signup', innovatorController.get_signup_page);
router.get('/login', innovatorController.get_login_page);
// router.get(/main, innovatorController.get_main_page); 
router.get('/info', innovatorController.get_info_page);
router.get('/request', innovatorController.get_request_page);
router.get('/history', innovatorController.get_history_page);

// API
router.post('/signup', innovatorController.signup);
router.post('/login', innovatorController.login);
router.get('/innovator', innovatorController.innovator);

module.exports = router;