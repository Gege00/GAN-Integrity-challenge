"strict use";

const { startConsumer } = require("./services/consumer.js");

async function initConsumer() {
  try {
    await startConsumer();
  } catch (error) {
    console.error(error);
  }
}

initConsumer();
