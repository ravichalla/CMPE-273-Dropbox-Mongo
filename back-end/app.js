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
            res.send();
        }
        else {
            res.send(results);
        }
    });
});

app.post('/deleteFile', function(req, res) {

   console.log("In app.js - deleteFile - id : " + req.body.id);

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

app.post('/starFile', function(req, res) {

    console.log("In app.js - starFile - id : " + req.body.id);

    kafka.make_request('star_request', 'star_response', req.body.id, function(err, results) {
        console.log("In app.js - starFile : Results - " + results);
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
    console.log("In app.js - uploadFille - request contains : " + req.file);

    console.log("The FILE TYPE IS : " + req.file.mimetype);
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

app.get('/getFiles', function (req, res) {

    console.log("In app.js - getImages - Username is " + req.session.username);

    kafka.make_request('getfiles_request', 'getfiles_response', req.session.username, function(err, results) {
        console.log("In app.js - getImages : Results - " + results);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/fileShare', function (req, res) {

    console.log("In app.js - shareFile - Request is : " + req);
    console.log("1: " + req.body.username);
    console.log("2: " + req.body.documentName);
    console.log("3: " + req.body.mimeType);
    console.log("4: " + req.body.path);
    console.log("5: " + req.body.sharedWith);

    var payload = {
        "username": req.session.username,
        "documentName": req.body.documentName,
        "documentType": req.body.mimeType,
        "path": req.body.path,
        "sharedWith": req.body.sharedWith
    }

    kafka.make_request('fileShare_request', 'fileShare_response', payload, function(err, results) {

        console.log("In app.js - fileShare : Results - " + results);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.get('/getDetails', function (req, res) {
    console.log("In app.js - getDetails - Username is " + req.session.username);

    kafka.make_request('getdetails_request', 'getdetails_response', req.session.username, function(err, results) {
        console.log("In app.js - getDetails : Results - " + results.overview);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/about', function (req, res) {

    var overview = req.body.overview;
    var work = req.body.work;
    var education = req.body.education;
    var contactNumber = req.body.contactNumber;
    var lifeEvents = req.body.lifeEvents;
    var music = req.body.music;
    var shows = req.body.shows;
    var sports = req.body.sports;

    var payload = {
        "username": req.session.username,
        "overview": overview,
        "work": work,
        "education": education,
        "contactNumber": contactNumber,
        "lifeEvents": lifeEvents,
        "music": music,
        "shows": shows,
        "sports": sports
    };

    kafka.make_request('about_request', 'about_response', payload, function (err, results) {
        console.log("In app.js - about : Results - " + results.status);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/createGroup', function (req, res) {

    console.log("In app.js - createGroup - Request is : " + req);
    console.log("1: " + req.body.groupname);

    var payload = {
        "owner": req.session.username,
        "groupname": req.body.groupname
    };

    kafka.make_request('createGroup_request', 'createGroup_response', payload, function(err, results) {

        console.log("In app.js - createGroup : Results - " + results);
        if (err) {
            res.send();
        }
        else {
            res.send(results);
        }
    });
});

app.get('/getGroups', function (req, res) {

    console.log("In app.js - getGroups - Username is " + req.session.username);

    kafka.make_request('getGroups_request', 'getGroups_response', req.session.username, function(err, results) {

        console.log("In app.js - getGroups : Results - " + results);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/updateUsernames', function (req, res) {

    payload = {
        "owner" : req.session.username,
        "groupname" : req.body.groupname,
        "usernames" : req.body.usernames
    };

    kafka.make_request('updateUsernames_request', 'updateUsernames_response', payload, function(err, results) {

        console.log("In app.js - updateUsernames : Results - " + results);
        if (err) {
            res.send();
        }
        else {
            res.send(results);
        }
    });

});

app.post('/groupShare', function (req, res) {

    console.log("In app.js - groupShare - Request is : " + req);
    console.log("1: " + req.body.username);
    console.log("2: " + req.body.documentName);
    console.log("3: " + req.body.documentType);
    console.log("4: " + req.body.path);
    console.log("5: " + req.body.groupname);

    var payload = {
        "username": req.session.username,
        "documentName": req.body.documentName,
        "documentType": req.body.documentType,
        "path": req.body.path,
        "groupname": req.body.groupname
    }

    kafka.make_request('groupShare_request', 'groupShare_response', payload, function(err, results) {

        console.log("In app.js - groupShare : Results - " + results);
        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

app.post('/deleteGroup', function(req, res) {

    console.log("In app.js - deleteGroup - id : " + req.body.id);

    kafka.make_request('deleteGroup_request', 'deleteGroup_response', req.body.id, function(err, results) {

        console.log("In app.js - deleteGroup : Results - " + results);

        if (err) {
            res.status(401).send();
        }
        else {
            res.status(201).send(results);
        }
    });
});

module.exports = app;
