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
                res.status = 201;
            }
            callback(null, res);
        });

    });
}

exports.handle_about = handle_about;