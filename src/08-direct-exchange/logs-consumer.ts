import * as amqp from "amqplib";

async function nfeConsumer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const exchange = "xpto.direct";
  const queue = "logs-queue";
  const routingKey = ["order.updated", "order.created"];

  await channel.assertExchange(exchange, "direct");
  await channel.assertQueue(queue);
  await Promise.all(
    routingKey.map((key) => channel.bindQueue(queue, exchange, key))
  );

  console.log(`Waiting for messages in queue: ${queue}`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const content = msg.content.toString();
      console.log(`Received: ${content}`);

      channel.ack(msg);
    }
  });
}

nfeConsumer().catch(console.error);
