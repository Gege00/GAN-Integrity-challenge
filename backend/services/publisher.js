'use strict'

const amqp = require("amqplib");

const sendMessage = async message => {

  const conn = await amqp.connect("amqp://rabbitmq");
  const channel = await conn.createChannel();

  const res = await channel.assertQueue(message.queue,{durable:true})
  if(!res.queue) throw new Error("failed to open the queue")

  channel.sendToQueue(message.queue, Buffer.from(JSON.stringify(message.data)), {deliveryMode: true});
  await channel.close()
  await conn.close()
  return true;


};

module.exports = { sendMessage };
