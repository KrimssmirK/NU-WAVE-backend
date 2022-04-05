const { Router } = require('express')
const sabaterController = require('../controllers/sabaterController')

const router = Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/', sabaterController.getName)

module.exports = router