const amqp = require("amqplib");
const { calculateNearCities } = require("../operations/area.js");

const startConsumer = async () => {
  console.log("Consumer starting...");
  try {
    const conn = await amqp.connect("amqp://rabbitmq?heartbeat=60");

    conn.on("error", function(error) {
      throw new Error("[AMQP] conn error", error.message);
    });

    const ch = await conn.createChannel();

    ch.on("error", function(error) {
      throw new Error("[AMQP] conn error", error.message);
    });

    await ch.assertQueue("area_calculation", { durable: true });
    ch.prefetch(1)
    ch.consume(
      "area_calculation",
      async message => {

        const { result, error } = calculateNearCities(
          JSON.parse(message.content)
        );

        //if any error occurs, should I cancel the request or ack it???
        //let's cancel it for now
        if (error) ch.cancel(message);

        ch.ack(message);
      },
      { noAck: false }
    );


  }
  catch(error){
    throw error

  }
};

module.exports = { startConsumer };
