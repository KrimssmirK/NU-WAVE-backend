const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv/config');

// API
module.exports.signup = (req,res) => {
    console.log('hello there im in the adminController');
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }

    Admin.findOne({email})
    .then(admin => {
        if(admin) return res.status(400).json({msg: 'Admin already exists'});


        const newAdmin = new Admin({ name, email, password });

        // Create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newAdmin.password = hash;
                newAdmin.save()
                    .then(admin => {
                        jwt.sign(
                            { id: admin._id },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,
                                    admin: {
                                        id: admin._id,
                                        name: admin.name,
                                        email: admin.email
                                    }
                                });
                            }
                        )
                    });
            })
        })
    })
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    res.status(400).json({msg: 'Please enter all fields'});
  }
  Admin.findOne({email})
    .then(admin => {
        if(!admin) return res.status(400).json({msg: 'admin does not exist'});

        // Validate password
        bcrypt.compare(password, admin.password)
            .then(isMatch => {
                if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'});

                jwt.sign(
                    { id: admin._id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if(err) throw err;
                        // res.json({
                        //     token,
                        //     admin: {
                        //         id: admin._id,
                        //         name: admin.name,
                        //         email: admin.email
                        //     }
                        // });
                        res.render('admin/main');
                    }
                )
            })
    })
};

module.exports.admin = (req,res) => {
  Admin.findById(req.admin.id)
    .select('-password')
    .then(admin => res.json(admin));
};


// VIEWS
module.exports.get_signup_page = (req, res) => {
  res.render('admin/signup', { title: 'Admin', uri: '/admin/signup', login_page: '/admin/login'});
};

module.exports.get_login_page = (req, res) => {
  res.render('admin/login', { title: 'Admin', uri: '/admin/login', signup_page: '/admin/signup'});
};

module.exports.get_approval_page = (req, res) => {
  res.render('admin/approval', {});
};
