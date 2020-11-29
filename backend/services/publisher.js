"use strict";

const amqp = require("amqplib");
//const Broker = require("rascal").BrokerAsPromised;
//const config = require("rascal_config.json");


const rabbitmq = "amqp://rabbitmq?heartbeat=60";

//URI for local use
// const rabbitmq = "amqp://localhost:5672?heartbeat=60"


const sendMessage = async message => {
  const conn = await amqp.connect(rabbitmq);
  const channel = await conn.createChannel();

  const res = await channel.assertQueue(message.queue, { durable: true });
  if (!res.queue) throw new Error("failed to open the queue");

  channel.sendToQueue(
    message.queue,
    Buffer.from(JSON.stringify(message.data)),
    { deliveryMode: true }
  );
  await channel.close();
  await conn.close();
  return true;

  const pusblish = async request => {
    console.log("Publishing...");

    const broker = await Broker.create(config);
    broker.on("error", console.error);
    const delivery = await publish(request.publishTo, request.message);
    delivery.on("error", console.error);
  };
};

module.exports = { sendMessage };
