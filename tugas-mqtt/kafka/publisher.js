const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092", "localhost:9093"],
});

const producer = kafka.producer();

async function runPublisher() {
  await producer.connect();
  await producer.send({
    topic: "mytopic",
    messages: [{ value: "Hello from node" }],
  });

  await producer.disconnect();
}

runPublisher();
