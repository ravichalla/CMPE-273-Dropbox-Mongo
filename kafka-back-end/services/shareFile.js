var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_shareFile(msg, callback) {

    var res = {};
    console.log("In shareFile.js - handle_shareFile : " + msg);

    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);

        var myCollection = mongo.collection('myCollection');
        var filesCollection = mongo.collection('filesCollection');

        console.log("In shareFile.js - Message is : " + msg.username);
        console.log("In shareFile.js - Document name : " + msg.documentName);
        console.log("In shareFile.js - Document type is : " + msg.mimetype);
        console.log("In shareFile.js - Document path is : " + msg.path);
        console.log("In shareFile.js - Shared with : " + msg.sharedWith);


        myCollection.findOne({username: msg.sharedWith}, function(err, user) {
            if(user) {
                filesCollection.insert({username : msg.sharedWith, documentName : msg.documentName, documentType : msg.mimetype, path : msg.path, star : false, fileOwner: msg.username}, function (err, user) {
                    if(err) {
                        console.log("Internal error");
                        res.status = 500;
                    }
                    else {
                        console.log("In shareFile - user : " + user);
                        res.status = 201;
                    }
                });
            }
            else {
                console.log("User not found");
                res.status = 404;
            }
            callback(null, res);
        });
    });
}

exports.handle_shareFile = handle_shareFile;