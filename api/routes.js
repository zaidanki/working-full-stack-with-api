const express = require('express');
const router = express.Router();
const Course = require("./models").Course;
const User = require("./models").User
const bcryptjs = require('bcryptjs')
const auth = require('basic-auth')

//Authenticator Building
const authenticateUser = (req, res, next) => {
    const credentials = auth(req);
    let message = null;
    if (credentials) {
        // Finding the One email where it matches credentials that are provided
        User.findOne({where: {emailAddress: credentials.name}}).then(
            data => {
                if (data) {
                    // Use the bcryptjs npm package to compare the user's password
                    const authenticated = bcryptjs
                        .compareSync(credentials.pass, data.password);

                    // If the passwords match...
                    if (authenticated) {
                        console.log(`Authentication successful for username: ${data.emailAddress}`);

                        // Then store the retrieved user object on the request object
                        // so any middleware functions that follow this middleware function
                        // will have access to the user's information.
                        req.currentUser = data;
                    } else {
                        message = `Authentication (password) failure for username: ${data.emailAddress}`;
                    }
                } else {
                    message = `User not found for username: ${credentials.name}`;
                }

            }
        ).catch(e => {
            res.status(500).json({Error: e})
        }).then( () => {
            if (message) {
                // Return a response with a 401 Unauthorized HTTP status code. and message
                res.status(401).json({ message: message });
            } else {
                // Or if user authentication succeeded...
                // Call the next() method.
                next();
            }
        }
    )} else{
        res.status(401).json({ message: 'You need to be Logged in'})
    }
}

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', (req, res) => {
    res.json({
        message: 'Welcome MY API, Either add /users OR /courses',
    });
});


// This is for users route

router.get('/allusers', (req, res) => {
    User.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] }
    }).then( data => {
    res.json(data)})
})

router.get('/users', authenticateUser, (req, res) => {
    //Basic Find All excluding some stuff
    const credentials = auth(req);
    User.findOne({
        where : {emailAddress : credentials.name},
        attributes: { exclude: ["createdAt", "updatedAt", "password"] }
    })
        .then(data =>{
            res.json(data)})
        .catch(err => res.status(500).json(err));
});

router.post('/users', (req, res) => {
    //finding user by id and then seeing if it exists, if not, function goes.
    User.findByPk(req.body.id).then( user => {
        if(!user){
            const userNew = req.body
            userNew.password = bcryptjs.hashSync(userNew.password)
            User.create(userNew).then( () => {
                res.location('/users').status(201).end()
            }).catch(e => {
                // Validation
                if(e.name === "SequelizeUniqueConstraintError" || "SequelizeValidationError"){
                    res.status(400).json(e.errors)
                } else {
                    res.status(500).json({Error: e})
                }})
        } else {
            res.status(403).json({Message: 'User Already Exists'})
        }
    }).catch(e => {
        res.status(400).json({Error: 'Password is Required'})
    })
});

// This is for Courses Routes
router.get('/courses', (req, res) => {
    // finding all Courses

    Course.findAll({
        attributes: { exclude: ["createdAt", "updatedAt"] }
    })
        .then(data => res.json(data))
        .catch(err => res.status(500).json(err));
});


// Get a single Course
router.get('/courses/:id', (req, res) => {
    Course.findByPk(req.params.id).then( book => {
        if(book){
            res.json(book)
        } else {
            res.status(404).json({message: 'Course not found'})

        }
    }).catch(error => {
        res.send(500, error);
    });
});

// Post a new Course
router.post('/courses', authenticateUser , (req, res) => {
    // checking if ID exists and if userID exists and then validating
    console.log(req.body)
    Course.findByPk(req.body.id).then((course) => {

        User.findByPk(req.body.userId).then( userId => {
            if(course){
                res.status(403).json({ message: 'This ID already exists'})
            }
           else if(req.body){
                Course.create(req.body).then(() => {
                    res.location('/courses/' + req.body.id).status(201).end()
                } ).catch(e => {
                    // a couple of Validators
                    if(e.name === "SequelizeValidationError" || "SequelizeUniqueConstraintError" ){
                        res.status(400).json({Error: e.errors})
                    }else {
                    res.status(500).json({Error: e})
                }})
            } else if(!userId) {
                res.status(400).json({message: 'User Not Found'})
            }
        })
            .catch(e => {
                res.status(500).json({Error: e})
            })
        } )
        .catch(e => {
            res.status(500).json({Error: e})
    })
});

// Update an existing Course
router.put('/courses/:id', authenticateUser , (req, res) => {
    const credentials = auth(req);

    Course.findByPk(req.params.id).then( course => {
        if(course){
            User.findByPk(course.userId).then( data => {
                console.log(data.emailAddress);
                if(data.emailAddress === credentials.name){
                course.update(req.body).then(res.status(204).end())
            } else {
                res.status(401).json({Error: 'User is not the one who posted, so you cant update'})
            }}).catch(e => {
                res.status(500).json({Error : e})
            })

        } else {
            res.status(403).json({ message: 'Cant Update a course that does not exist'})
        }
    }).catch(e => {
        res.status(500).json({Error: e})
    })
});

// Delete a course
router.delete('/courses/:id', authenticateUser , (req, res) => {
    const credentials = auth(req);

    Course.findByPk(req.params.id).then( course => {
        if(course){
            User.findByPk(course.userId).then( data => {
                console.log(data.emailAddress);
                if(data.emailAddress === credentials.name){
                    course.destroy().then(res.status(204).end())
                } else {
                    res.status(401).json({Error: 'User is not the one who posted, so you cant Delete'})
                }}).catch(e => {
                res.status(500).json({Error : e})
            })

        } else {
            res.status(403).json({ message: 'Cant delete a course that does not exist'})
        }
    }).catch(e => {
        res.status(500).json({Error: e})
    })
});




module.exports = router