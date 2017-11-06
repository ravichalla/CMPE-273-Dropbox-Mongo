var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_getFiles(msg, callback) {

    var res = {};
    console.log("In getFiles.js - handle_getFiles :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var filesCollection = mongo.collection('filesCollection');

        console.log("In getFiles.js - Username is : " + msg);

        filesCollection.find({username: msg}).toArray(function (err, file) {
            if (file) {
                console.log(file);
                // console.log("2:" + file[0].email);
                // console.log("3:" + file[0].documentName);
                // console.log("4:" + file[0].documentType);
                // console.log("5:" + file[0].path);
                // console.log("6:" + file[0].star);

                callback(null, file);

            } else {
                console.log("Failed to fetch");
                callback(err, null);
            }
        });
    });
}

exports.handle_getFiles = handle_getFiles;