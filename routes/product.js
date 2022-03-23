const { Router } = require('express')
const productController = require('../controllers/productController')
const router = Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/product/upload', productController.get_upload_product_page)
router.post('/product', productController.upload.array('images'), productController.add_product)

// product page
router.get('/product/detail/:_id', productController.get_product_detail)
router.get('/product/images/:_id', productController.get_product_images)
router.get('/product/ratings/guest/:_id', productController.check_if_the_guest_has_rated_the_product)
router.post('/product/ratings/guest/:_id', productController.guest_rate_the_product)
router.get('/product/views/:_id', productController.get_no_of_views)
router.get('/product/like/guest/:_id', productController.check_if_the_guest_has_liked_the_product)
router.post('/product/like/:_id', productController.push_like_button)
router.post('/product/unlike/:_id', productController.push_unlike_button)


// products page
router.get('/products/:exhibit_name', productController.get_products)
router.get('/product/image/:_id', productController.get_product_main_image)


// route for submitting the purchase button
router.post('/product/purchase/:_id', productController.purchase)



module.exports = router

/*
manually to request (POST)

curl -X POST [options] [URL]

---------------------likes---------------------------
2 examples products (Advocates and E-Lip-Sees)
enabling the like button
curl -X POST http://localhost:3000/api/product/like/Advocates
curl -X POST http://localhost:3000/api/product/like/E-Lip-Sees

disabling the like button
curl -X POST http://localhost:3000/api/product/unlike/Advocates
curl -X POST http://localhost:3000/api/product/unlike/E-Lip-Sees

checking if the guest has liked the product
curl -X POST http://localhost:3000/api/product/like/guest/Advocates
curl -X POST http://localhost:3000/api/product/like/guest/E-Lip-Sees

*/

/*

purchasing

curl -X POST http://localhost:3000/api/product/purchase/234dsfa2

curl -X POST https://nu-centie.herokuapp.com/api/product/purchase/:product_id



*/

/*

getting specific product

curl http://localhost:3000/api/product/620addfc9c7b0c5e661d6c10

*/