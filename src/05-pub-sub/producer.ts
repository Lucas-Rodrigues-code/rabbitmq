import amqp from "amqplib";

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queueHello = "hello";
  const queueProducts = "products";

  await channel.assertQueue(queueHello);
  await channel.assertQueue(queueProducts);

  //binding tem que ser feito na interface do RabbitMQ management com a exchange fanout

  const messages = new Array(1000).fill(0).map((_, i) => ({
    id: i,
    name: `Product ${i}`,
    price: Math.floor(Math.random() * 100),
  }));

  await Promise.all(
    messages.map((msg) => {
      channel.publish("amq.fanout","",Buffer.from(JSON.stringify(msg)), {
        contentType: "application/json",
      });
    })
  );
console.log(`Sent: ${JSON.stringify(messages)}`);
  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

producer().catch(console.error);
