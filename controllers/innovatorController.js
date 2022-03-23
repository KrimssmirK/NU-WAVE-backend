const Innovator = require('../models/Innovator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv/config');

module.exports.signup = (req,res) => {
    console.log('hello there im in the innovatorController');
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }

    Innovator.findOne({email})
    .then(innovator => {
        if(innovator) return res.status(400).json({msg: 'Innovator already exists'});


        const newInnovator = new Innovator({ name, email, password });

        // Create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newInnovator.password = hash;
                newInnovator.save()
                    .then(innovator => {
                        jwt.sign(
                            { id: innovator._id },
                            process.env.JWT_SECRET_KEY,
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,
                                    innovator: {
                                        id: innovator._id,
                                        name: innovator.name,
                                        email: innovator.email
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
  Innovator.findOne({email})
    .then(innovator => {
        if(!innovator) return res.status(400).json({msg: 'Innovator does not exist'});

        // Validate password
        bcrypt.compare(password, innovator.password)
            .then(isMatch => {
                if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'});

                jwt.sign(
                    { id: innovator._id },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if(err) throw err;
                        // res.json({
                        //     token,
                        //     innovator: {
                        //         id: innovator._id,
                        //         name: innovator.name,
                        //         email: innovator.email
                        //     }
                        // });
                        res.render('innovator/main', {
                            token,
                            innovator: {
                                id: innovator._id,
                                name: innovator.name,
                                email: innovator.email
                            }
                        });
                    }
                )
            })
    })
};

module.exports.innovator = (req,res) => {
  Innovator.findById(req.innovator.id)
    .select('-password')
    .then(innovator => res.json(innovator));
};

module.exports.get_signup_page = (req, res) => {
  res.render('innovator/signup');
};

module.exports.get_login_page = (req, res) => {
  res.render('innovator/login');
};

module.exports.get_info_page = (req, res) => {
  res.render('innovator/info');
};

module.exports.get_request_page = (req, res) => {
  res.render('innovator/request');
};

module.exports.get_history_page = (req, res) => {
    // do something 
  res.render('innovator/history');
};