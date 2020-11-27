"strict use";

const amqp  = require("amqplib");
const {calculateNearCities} = require('./services/area.js')


function init() {
  amqp
    .connect("amqp://rabbitmq?heartbeat=60")
    .then(conn => {
      conn.on("error", function(err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });

      conn
        .createChannel()
        .then(ch => {
          ch.assertQueue("area_calculation", { durable: true }).then(() => {
            ch.prefetch(1);
            ch.consume("area_calculation", calculateNearCities, { noAck: false });
            console.log(" [*] Waiting for messages.");
          });
        })
        .catch(err => {
          console.error("[AMQP]", err.message);
          return setTimeout(init, 1000);
        });
    })
    .catch(err => {
      console.error("[AMQP]", err.message);
      return setTimeout(init, 1000);
    });
}

init();
