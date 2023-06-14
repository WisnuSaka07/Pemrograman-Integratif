const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', (err, connection) => {
    if(err){
        throw err;
    }
    connection.createChannel((err, channel) => {
        if(err){
            throw err;
        }
        let queue = "my topic"
        let message = "Hello World!"

        channel.assertQueue(queue, {
            durable : false
        })
        channel.sendToQueue(queue, Buffer.from(message));
        console.log(`message : ${message}`)
    })
})