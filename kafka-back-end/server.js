var connection = new require('./kafka/Connection');
var login = require('./services/login');
var signup = require('./services/signup');
var getFiles = require('./services/getFiles');

var consumer = connection.getConsumer();
var producer = connection.getProducer();


consumer.on('message', function (message) {
    console.log('In server.js : Message Received for topic: ' + message.topic);

    var data = JSON.parse(message.value);
    console.log('reply topic ' + data.replyTo);

    switch (message.topic) {
        case "login_request":
            console.log("In server.js - login_request case");
            login.handle_login(data.data, function (err, res) {
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                console.log("In server.js - sending payload" + payloads);

                producer.send(payloads, function (err, data) {
                    if (err)
                        console.log(err);
                });
                return;
            });
            break;

        case "signup_request":
            console.log("In server.js - signup_request case");
            signup.handle_signup(data.data, function (err, res) {
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    if (err)
                        console.log(err);
                });
                return;
            });
            break;

        case "getfiles_request":
            console.log("In server.js - getfiles_request case");
            console.log("This is data.data : " + data.data);
            getFiles.handle_getFiles(data.data, function (err, res) {
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res
                            }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function(err, data) {
                    if(err)
                        console.log(err);
                });
                return;
            });
            break;
    }
});