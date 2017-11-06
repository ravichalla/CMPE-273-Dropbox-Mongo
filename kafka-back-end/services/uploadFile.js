var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');
//var ObjectId = require('mongodb').ObjectID;



function handle_uploadFile(msg, callback) {

    var res = {};
    console.log("In uploadFile.js - handle_uploadFile : " + msg);

    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);

        var filesCollection = mongo.collection('filesCollection');

        console.log("In uploadFile.js - Message is : " + msg);
        console.log("In uploadFile.js - Document name : " + msg.file.documentName);
        console.log("In uploadFile.js - Document type is : " + msg.file.mimetype);
        console.log("In uploadFile.js - Document path is : " + msg.file.path);

        filesCollection.insert({username : "a@b.com", documentName : msg.file.documentName, documentType : msg.file.mimetype, path : msg.file.path, star : false}, function (err, user) {
            if(err) {
                res.status = 500;
            }
            else {
                console.log("In uploadFile - user : " + user);
                res.status = 201;
            }
            callback(null, res);
        });
    });
}

exports.handle_uploadFile = handle_uploadFile;