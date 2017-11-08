var crypto = require('crypto');
var conn = require('./Connection');

var TIMEOUT = 80000;
var self;

exports = module.exports = new KafkaRPC;

function KafkaRPC() {
    self = this;
    this.connection = conn;
    this.requests = {};
    this.response_queue = false;
    this.producer = this.connection.getProducer();
}

KafkaRPC.prototype.makeRequest = function (request_queue, response_queue, content, callback) {

    console.log("This is content ------- " + content);
    self = this;

    var correlationId = crypto.randomBytes(16).toString('hex');

    var tId = setTimeout(function (corr_id) {
        callback(new Error("timeout " + corr_id));
        delete self.requests[corr_id];
    }, TIMEOUT, correlationId);

    var entry = {
        callback: callback,
        timeout: tId
    };

    self.requests[correlationId] = entry;

    self.setupResponseQueue(self.producer, request_queue, response_queue, function () {

        var payloads = [
            {
                topic: request_queue,
                messages: JSON.stringify({
                    correlationId: correlationId,
                    replyTo: response_queue,
                    data: content
                }),
                partition: 0
            }
        ];


        self.producer.send(payloads, function (err, data) {

            console.log("In kafkarpc.js - producer.send : " + data);
            console.log(data);

            if (err)
                console.log(err);
        });
    });
};

KafkaRPC.prototype.setupResponseQueue = function (producer, request_queue, response_queue, next) {
    if (this.response_queue) return next();

    self = this;
    console.log("in setupResponseQueue");

    var consumer = self.connection.getConsumer(response_queue);

    consumer.on('message', function (message) {
        console.log('In kafkarpc - message received for topic : ' + message.topic);
        var data = JSON.parse(message.value);
        var correlationId = data.correlationId;
        if (correlationId in self.requests) {
            var entry = self.requests[correlationId];
            clearTimeout(entry.timeout);
            delete self.requests[correlationId];
            entry.callback(null, data.data);
        }
    });

    self.response_queue = true;
    return next();
};