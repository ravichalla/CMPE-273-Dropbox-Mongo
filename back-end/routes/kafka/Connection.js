var kafka = require('kafka-node');
var topics = [
    {topic: 'login_response', partition: 0},
    {topic: 'signup_response', partition: 0},
    {topic: 'getfiles_response', partition: 0},
    {topic: 'delete_response', partition: 0},
    {topic: 'upload_response', partition: 0},
    {topic: 'fileShare_response', partition: 0},
    {topic: 'about_response', partition: 0}

];

function ConnectionProvider() {

    this.getConsumer = function(topic_name) {
        if (!this.kafkaConsumerConnection) {

            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client, topics);
            this.client.on('ready', function () { console.log('In Back-end - Connection.js : Client ready!') })
        }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            var HighLevelProducer = kafka.HighLevelProducer;
            this.kafkaProducerConnection = new HighLevelProducer(this.client);
            //this.kafkaConnection = new kafka.Producer(this.client);
            console.log('In Back-end - Connection.js : Producer ready');
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;