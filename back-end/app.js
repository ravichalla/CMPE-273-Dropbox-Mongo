var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var cors = require('cors');
require('./routes/passport')(passport);

var multer = require('multer');
var glob = require('glob');
var shelljs = require('shelljs');

var kafka = require('./routes/kafka/client');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongoSessionURL = "mongodb://localhost:27017/sessions";
//use expressSessions for persistent login sessions
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
}
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(expressSessions({
    secret: "CMPE273_passport",
    resave: false,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));

app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

app.post('/logout', function (req, res) {
    console.log(req.session.user);
    req.session.destroy();
    console.log('Session Destroyed');
    res.status(200).send();
});

app.post('/login', function (req, res) {
    passport.authenticate('login', function (err, user) {
        if (err) {
            res.status(500).send();
        }
        else if (!user) {
            console.log("In app.js - in login : No user");
            res.status(401).send();
        }
        else {
            req.session.username = user.username;
            console.log("In app.js : User is - " + req.session.user);
            console.log("session initilized");
            return res.status(201).send(user);
        }
    })(req, res);
});

app.post('/signup', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;

    var newFolderPath = path.resolve(__dirname,'./','public','uploads');
    console.log("Making new directory in ------ " + newFolderPath + "/" + username);
    shelljs.mkdir(newFolderPath + "/" + username);

    var payload = {
        "username": username,
        "password": password,
        "firstname": firstname,
        "lastname": lastname
    };

    kafka.make_request('signup_request', 'signup_response', payload, function (err, results) {
        console.log("In app.js - signup : Results - " + results);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/deleteFile', function(req, res) {

   console.log("In app.js - deleteFille - id : " + req.body.id);

   kafka.make_request('delete_request', 'delete_response', req.body.id, function(err, results) {
       console.log("In app.js - deleteFile : Results - " + results);
       if (err) {
           res.status(401).send();
       }
       else {
           res.status(201).send(results);
       }
   });
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req.session.username);
        cb(null, './public/uploads/' + req.session.username + '/')
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname)
    }
});

var upload = multer({storage:storage});

app.post('/uploadFile', upload.single('myfile'), function(req, res) {

    console.log("In app.js - uploadFille - request contains : " + req);

    var payload = {
        "username": req.session.username,
        "documentName": req.file.originalname,
        "documentType": req.file.mimetype,
        "path": req.file.path,
        "star": false
    }

    kafka.make_request('upload_request', 'upload_response', payload, function(err, results) {
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });

});

app.get('/getImages', function (req, res) {
    console.log("In app.js - getImages - Username is " + req.session.username);
    kafka.make_request('getfiles_request', 'getfiles_response', req.session.username, function(err, results) {
        console.log("In app.js - signup : Results - " + results);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/getDetails', function (req, res) {
    mongo.connect(mongoSessionURL, function () {
        var myCollection = mongo.collection('myCollection');

        console.log("app.js - getDetails - " + req.username);
        console.log("app.js - getDetails - " + req.body.username);

        myCollection.findOne({username: req.body.username}, function (err, user) {
            if (err) {
                res.status(500).send();
            }
            return res.status(201).send(user);
        });

    })
});

app.post('/about', function (req, res) {
    mongo.connect(mongoSessionURL, function () {
        var myCollection = mongo.collection('myCollection');

        console.log("app.js - /about - " + req.body.username, req.body.overview, req.body.work);

        myCollection.find({username: req.body.username}, function (err, user) {
            console.log("1");
            if (user) {
                console.log("2");
                myCollection.updateMany({username: req.body.username}, {
                    $set: {
                        overview: req.body.overview, work: req.body.work, education: req.body.education,
                        contactNumber: req.body.contactNumber, lifeEvents: req.body.lifeEvents, music: req.body.music,
                        shows: req.body.shows, sports: req.body.sports
                    }
                }, function (err, user) {
                    console.log("3");
                    if (err) {
                        console.log("4");
                        res.status(401).send();
                    }
                    res.status(201).send();
                });
            }
            else {
                console.log("5");
                res.status(401).send();
            }
        });

    })
});

module.exports = app;
