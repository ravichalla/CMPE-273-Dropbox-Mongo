var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_signup(msg, callback) {

    var res = {};
    console.log("In signup.js - handle_signup :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var myCollection = mongo.collection('myCollection');

        console.log("1: " + msg.username);
        console.log("2: " + msg.password);

        myCollection.findOne({username: msg.username}, function(err, user) {

            if(user) {
                console.log("1");
                res.status = 401;
                callback(null, res);
            }
            else if(msg.username === "" || msg.password === "" || msg.firstname === "" || msg.lastname === "") {
                console.log("2");
                res.status = 403;
                callback(null, res);
            }
            else {
                myCollection.insert({username: msg.username, password: msg.password, firstname: msg.firstname, lastname: msg.lastname}, function (err, user) {
                    if(err) {
                        console.log("3");
                        res.status = 500;
                        callback(null, res);
                    }
                    else {
                        console.log("4");
                        res.status = 200;
                        callback(null, res);
                    }
                });
            }
        });
    });
}

exports.handle_signup = handle_signup;