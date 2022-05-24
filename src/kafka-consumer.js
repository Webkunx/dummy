const { Kafka, CompressionTypes, CompressionCodecs } = require("kafkajs");
const LZ4 = require("kafkajs-lz4");

const startKafkaConsumer = async () => {
  CompressionCodecs[CompressionTypes.LZ4] = new LZ4().codec;
  const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: JSON.parse(process.env.KAFKA_BROKERS),
  });

  const producer = kafka.producer();
  await producer.connect();
  const consumer = kafka.consumer({
    groupId: process.env.KAFKA_GROUP_ID,
    autoCommitInterval: 10,
    autoCommitThreshold: 1,
  });
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.KAFKA_TOPIC_TO_CONSUME,
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const stringifiedMessage = message.value.toString();
      const parsedMessage = JSON.parse(stringifiedMessage);
      const { headers } = parsedMessage;
      console.dir({
        value: stringifiedMessage,
        topic,
        partition,
      });
      if (!headers.awaitsResponse) return;
      const { topicToRespond, partitionToRespond } = headers;
      await producer.send({
        topic: topicToRespond,
        compression: CompressionTypes.LZ4,
        messages: [
          { partition: partitionToRespond, value: stringifiedMessage },
        ],
      });
    },
  });
};

module.exports = {
  startKafkaConsumer,
};
