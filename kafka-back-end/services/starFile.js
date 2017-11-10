var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');
var ObjectId = require('mongodb').ObjectID;

function handle_starFile(msg, callback) {

    var res = {};
    console.log("In starFile.js - handle_starFile : " + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var filesCollection = mongo.collection('filesCollection');
        var finalValue = null;
        console.log("In deleteFile.js - Id is : " + msg);

        filesCollection.findOne({_id: ObjectId(msg)}, function (err, user) {
            if (user) {
                console.log("Id is : " + user._id);
                console.log("Username is : " + user.username);
                console.log("Star value is : " + user.star);

                if (user.star === false) {
                    console.log("FALSE to TRUE");
                    filesCollection.update({_id: ObjectId(msg)}, {
                        $set: {
                            star: true,
                            starImage: "https://goo.gl/gFscdw"
                        }
                    });
                    finalValue = true;
                }
                else if (user.star === true) {
                    console.log("TRUE to FALSE");
                    filesCollection.update({_id: ObjectId(msg)}, {
                        $set: {
                            star: false,
                            starImage: "https://goo.gl/6utW2q"
                        }
                    });
                    finalValue = false;
                }
                res.status = 201;
                res.starValue = finalValue;
            }
            else {
                res.status = 404;
            }

            console.log("Final Star Value : " + res.starValue);
            callback(null, res);
        });
    });
}

exports.handle_starFile = handle_starFile;