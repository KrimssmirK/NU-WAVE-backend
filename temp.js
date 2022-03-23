var path = require('path');
var bodyParser = require('body-parser');
var fs = require('fs');

// /////////////tutorial for mongoose schema///////////////////////////////////////

// step 1 - set up mongoose
var mongoose = require('mongoose'); // to be able to use mongoose

// step 2 - connect to the database
const dbURL = require('./routers/config').dbURL;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};


// step 3 - create a schema for Image model

// EJS is specifically designed for building single-page, multi-page, and hybrid web applications.
// The default behavior of EJS is that it looks into the `views` folder for the templates to render.
// step 4 - set up EJS
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// We will define the storage path for the image we are uploading.
// Here, we are using the middleware Multer to upload the photo to the server 
// in a folder called `uploads` so we can process it.
// step 5 - set up multer for storing uploaded files
var multer = require('multer'); // to be able to use multer

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
    },
});

var upload = multer({ storage: storage });

// step 6 - load the mongoose model for Image
var imgModel = require('./models/exhibitModel');


// Set up the handler for the GET request to our server. 
// The response displays an HTML page showing all the images stored in the database, 
// and provides a UI for uploading new images.
// step 7 - the GET request handler that provides the HTML UI
app.get('/', function (req, res) {
    mongoose.connect(dbURL, options, function (err) { // third arg is a callback
        console.log('connected');
        var mongoDB = mongoose.connection;
        

        imgModel.find({} , function (err, items) {
            if (err) {
                console.log(err);
                res.status(500).send('An error occured', err);
            }else{
                res.render('imagesPage', { items: items} );
            }
        });
    });
});

// step 8 - the POST handler for processing the uploaded file
app.post('/', upload.single('image'), function (req, res) {
    var obj = {
        name: req.body.name,
        description: req.body.description,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png',
        },
    };
  
        var mongoDB = mongoose.connection;

        imgModel.save();
  
});

// step 9 - Configure the server to default port
// step 10 - add ejs file and this will be the views


// ////////////////////////////////////////////////////
