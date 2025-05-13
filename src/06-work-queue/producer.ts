import amqp from "amqplib";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function producer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "work_queue";

  await channel.assertQueue(queue);

  for (let i = 1; i < 50; i++) {
    const dots = ".".repeat(i);
    const message = `Tarefa ${i} ${dots}`;

    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Sent: ${message}`);
    await sleep(500);
  }
  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

producer().catch(console.error);
