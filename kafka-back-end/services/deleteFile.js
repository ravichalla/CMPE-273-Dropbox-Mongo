var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');
var ObjectId = require('mongodb').ObjectID;

function handle_deleteFile(msg, callback) {

    var res = {};
    console.log("In deleteFile.js - handle_deleteFile : " + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var filesCollection = mongo.collection('filesCollection');

        console.log("In deleteFile.js - Id is : " + msg);

        filesCollection.remove({"_id": ObjectId("59fa63e8e2bd891938aaced2")}, function (err, user) {
            if(err) {
                res.status = 500;
            }
            else {
                console.log("In deleteFile - user : " + user);
                res.status = 201;
            }
            callback(null, res);
        });
    });
}

exports.handle_deleteFile = handle_deleteFile;