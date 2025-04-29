import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "hello";
  const msg = "Hello World!";

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(msg));
  console.log(`Sent: ${msg}`);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

producer().catch(console.error);
