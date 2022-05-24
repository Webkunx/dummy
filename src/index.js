const { startFastifyServer } = require("./fastify-server");
const { startKafkaConsumer } = require("./kafka-consumer");
const dotenv = require("dotenv");
dotenv.config();
startFastifyServer();
startKafkaConsumer();
