import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "products";
  const msg = JSON.stringify({ id: 1, name: "Product 1", price: 100 });

  await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(msg), {
      contentType: "application/json",
  });
  console.log(`Sent: ${msg}`);

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

producer().catch(console.error);
