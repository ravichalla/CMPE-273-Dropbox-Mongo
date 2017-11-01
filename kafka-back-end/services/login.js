var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_login(msg, callback) {

    var res = {};
    console.log("In login.js - handle_login :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var myCollection = mongo.collection('myCollection');

        myCollection.findOne({username: msg.username, password: msg.password}, function (err, user) {
            if (user) {
                console.log("1:" + user);
                console.log("2:" + msg.username);
                console.log("3: " + user.password);
                res.username = msg.username;
                res.password = msg.password;
                res.status = 201;
                res.value = "Success Login";

            } else {
                res.status = 401;
                res.value = "Failed Login";
            }
            callback(null, res);
        });
    });
}

exports.handle_login = handle_login;