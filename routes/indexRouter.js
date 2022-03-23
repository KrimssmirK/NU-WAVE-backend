var router = require('express').Router(); // mini Express application
var bodyParser = require('body-parser');
require('dotenv/config');

router.use(bodyParser.urlencoded({ extended: false })); 
router.use(bodyParser.json()); // uses json middleware

var mongoose = require('mongoose');
var usernamePassword = process.env.MONGO_INFO;
var dbName = 'centie';
var controll = process.env.ACCESS_CONTROL;
var dbURL = usernamePassword + dbName + controll; // it uses dotenv/config
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


// models
var exhibitModel = require('../models/exhibitModel');



router.route('/')
        .get(function (req, res) {
            mongoose.connect(dbURL, options, (err) => {
                // query
                exhibitModel.find({}, (err, items) => {
                    // helper for translation between bin to string (base64)
                    function convertBufferToString(){
                        var exhibits = [];
                        for(var i = 0; i < items.length; i++){
                            var exhibit = {
                                name: items[i].name,
                                description: items[i].description,
                                imgInfo: {
                                    data: items[i].imgInfo.data.toString('base64'),
                                    contentType: items[i].imgInfo.contentType,
                                },
                            };
                            exhibits.push(exhibit);
                        }
                        console.log(exhibits);
                        res.status(200).send(exhibits);
                        mongoose.connection.close();
                        console.log('sent exhibit to index page for carousel and db disconnected');
                    }
                    convertBufferToString();
                });
            });
        });



module.exports = router;

        // add
            //     var newExhibit = new exhibitModel({ name: 'me', description: 'me again' });
            //     newExhibit.save((err, exhibit) => {
            //         console.log('success to insert one document!');
            //         mongoose.connection.close();
            //         console.log('disconnected');
            //     });



// initial trial for connecting to the mongodb
// MongoClient.connect(dbURL/*url of mongoDB*/, function (err, mongo) { // it takes two arguments for error connection and mongo itself
//     if (err) throw err;
//     var centie = mongo.db('centie'); // creating database for centie if it does not exist

//     centie.collection('exhibits').find({}).toArray(function (err, result) {
//         if (err) throw err;
//         console.log(result); // just to see the data come from mongodb
//         res.send('SUCCESS!!!!');
//         mongo.close(); // if you do not close the mongoDB and you will be charged
//     });
// });