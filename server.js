// libraries
const express = require('express')
const mongoose = require('mongoose')

// routes
const exhibitRoutes = require('./routes/exhibit')
const productRoutes = require('./routes/product')
const sabaterRoutes = require('./routes/sabater')

const app = express()
app.set("view engine", "ejs")

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });

const guestController = require('./controllers/guestController')
app.use('/', guestController.guest_visit_the_website)

// API
app.use('/api', exhibitRoutes)
app.use('/api', productRoutes)
app.use('/sabater', sabaterRoutes)

// const local_DB_URI = 'mongodb://127.0.0.1:27017/centie'
const local_DB_ATLAS = 'mongodb+srv://krimssmirk:t1uYuNFqKRlXhWmr@cluster0.21jlv.mongodb.net/centie?retryWrites=true&w=majority'
const dbURI = process.env.MONGODB_URI || local_DB_ATLAS || local_DB_URI
const port = process.env.PORT || 3000
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => app.listen(port, () => console.log(`Server running on port ${port}`)))
//   .catch((err) => console.log(err))
app.listen(port, () => console.log(`Server running on port ${port}`)) 
