"strict use";

const { startConsumer } = require("./services/consumer.js");

async function initConsumer() {
  try {
    await startConsumer();
  } catch (error) {
    throw error;
  }
}



process.on("unhandledRejection", reason => {
  throw reason;
});

process.on("uncaughtException", reason => {
  if (reason) console.log(reason);
  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received,");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal received");
  process.exit(0);
});

initConsumer();
