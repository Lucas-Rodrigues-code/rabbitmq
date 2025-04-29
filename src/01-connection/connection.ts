import * as amqp from "amqplib";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
    console.log("Connected to RabbitMQ");

    const channel = await connection.createChannel();
    console.log("Channel created");

    await sleep(30000); // Keep the connection open for 30 seconds

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
}

connect();