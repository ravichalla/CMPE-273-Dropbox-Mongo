var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_about(msg, callback) {

    var res = {};
    console.log("In about.js - handle_about :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var myCollection = mongo.collection('myCollection');

        console.log("The username is : " + msg.username);

        myCollection.update({username: msg.username}, {
            $set: {
                overview: msg.overview, work: msg.work, education: msg.education,
                contactNumber: msg.contactNumber, lifeEvents: msg.lifeEvents, music: msg.music,
                shows: msg.shows, sports: msg.sports
            }
        }, function (err, user) {
            if (err) {
                console.log("3");
                res.status = 500;
            }
            else {
                console.log("4");
                res.overview = msg.overview;
                res.work = msg.work;
                res.education = msg.education;
                res.contactNumber = msg.contactNumber;
                res.lifeEvents = msg.lifeEvents;
                res.music = msg.music;
                res.shows = msg.shows;
                res.sports = msg.sports;
                res.status = 201;
            }
            callback(null, res);
        });

    });
}

function handle_getDetails(msg, callback) {

    var res = {};
    console.log("In about.js - handle_getDetails :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var myCollection = mongo.collection('myCollection');

        console.log("The username is : " + msg);

        myCollection.findOne({username: msg}, function (err, user) {
            if (err) {
                console.log("000");
                res.status = 500;
            }
            else {
                console.log("0000");
                console.log(user.overview);
                res.overview = user.overview;
                res.work = user.work;
                res.education = user.education;
                res.contactNumber = user.contactNumber;
                res.lifeEvents = user.lifeEvents;
                res.music = user.music;
                res.shows = user.shows;
                res.sports = user.sports;
                res.status = 204;
            }
            callback(null, res);
        });

    });
}



exports.handle_about = handle_about;
exports.handle_getDetails = handle_getDetails;