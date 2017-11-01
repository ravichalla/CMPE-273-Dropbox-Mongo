var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

module.exports = function (passport) {
    passport.use('login', new LocalStrategy(function (username, password, done) {
        kafka.make_request('login_request', 'login_response', {"username": username, "password": password}, function (err, results) {
            console.log("In passport.js : Results - " + results);
            if (err) {
                done(err, {});
            }
            else {
                if (results.status == 201) {
                    done(null, results);
                }
                else {
                    done(null, false);
                }
            }
        });
    }));
};


