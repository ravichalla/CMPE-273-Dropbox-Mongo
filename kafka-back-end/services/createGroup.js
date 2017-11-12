var mongoURL = "mongodb://localhost:27017/sessions";
var mongo = require('./mongo');

function handle_createGroup(msg, callback) {

    var res = {};
    console.log("In createGroup.js - handle_createGroup :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var groupCollection = mongo.collection('groupCollection');

        console.log("The group owner is : " + msg.owner);

        groupCollection.insert({owner: msg.owner, groupname: msg.groupname, usernames: ""}, function (err, user) {
            if (err) {
                res.status = 500;
            }
            else {
                console.log("In handle_createGroup - user : " + user);
                res.status = 201;
            }
            callback(null, res);
        });
    });
};

function handle_getGroups(msg, callback) {

    var res = {};
    console.log("In createGroup.js - handle_getGroups :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var groupCollection = mongo.collection('groupCollection');

        console.log("In createGroup.js - Username is : " + msg);

        groupCollection.find({owner: msg}).toArray(function (err, file) {
            if (file) {
                // console.log("1:" + file);
                // console.log("2:" + file[0].username);
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
};

function handle_updateUsernames(msg, callback) {

    var res = {};
    console.log("In createGroup.js - handle_updateUsernames :" + JSON.stringify(msg));

    mongo.connect(mongoURL, function () {
        console.log('Connected to mongo at: ' + mongoURL);
        var groupCollection = mongo.collection('groupCollection');

        console.log("In createGroup.js - Username is : " + msg);

        groupCollection.update({groupname: msg.groupname}, {
            $set: {
                usernames: msg.usernames
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
};

function handle_groupShare(msg, callback) {

    var res = {};
    var usernames = [];

    console.log("In groupShare.js - handle_groupShare : " + msg);

    mongo.connect(mongoURL, function () {

        console.log('Connected to mongo at: ' + mongoURL);

        var groupCollection = mongo.collection('groupCollection');
        var filesCollection = mongo.collection('filesCollection');

        console.log("In groupShare.js - Message is : " + msg.username);
        console.log("In groupShare.js - Document name : " + msg.documentName);
        console.log("In groupShare.js - Document type is : " + msg.documentType);
        console.log("In groupShare.js - Document path is : " + msg.path);
        console.log("In groupShare.js - Groupname is : " + msg.groupname);

        groupCollection.findOne({groupname: msg.groupname}, function (err, user) {
            if (user) {
                console.log("Usernames in group " + user.groupname + " are " + user.usernames);

                usernames = user.usernames.split(",");
                console.log(usernames);

                for (var i = 0; i < usernames.length - 1; i++) {
                    console.log(i + " : " + usernames[i]);

                    filesCollection.insert({username: usernames[i], documentName: msg.documentName, documentType: msg.documentType,
                            path: msg.path, star: false, starImage: "https://goo.gl/6utW2q", fileOwner: msg.username
                    }, function (err, user) {
                        if (err) {
                            console.log("Internal error");
                            res.status = 500;
                        }
                        else {
                            console.log("In groupShare - user : " + user);
                            res.status = 201;
                        }
                    });
                }


            }
            else {
                console.log("Group not found");
                res.status = 404;
            }
            callback(null, res);
        });
    });
}

exports.handle_createGroup = handle_createGroup;
exports.handle_getGroups = handle_getGroups;
exports.handle_updateUsernames = handle_updateUsernames;
exports.handle_groupShare = handle_groupShare;
