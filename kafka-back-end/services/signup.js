var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_signup(msg, callback) {

    var res = {};
    console.log("In signup.js - handle_signup :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var myCollection = mongo.collection('myCollection');

        myCollection.findOne({username: msg.username}, function(err, user) {
            if(user) {
                res.status = 401;
            }
            else {
                myCollection.insert({username: msg.username, password: msg.password, firstname: msg.firstname, lastname: msg.lastname}, function (err, user) {
                    if(err) {
                        res.status = 500;
                    }
                    else {
                        res.status = 201;
                    }
                });
            }
            callback(null, res);
        });
    });
}

exports.handle_signup = handle_signup;