import amqp from "amqplib";

async function consumer() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const queue = "work_queue";

  await channel.assertQueue(queue);

  channel.consume(
    queue,
    (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        console.log(`Received: ${content}`);

        const dots = content.split(".").length - 1;
        const timeToProcess = dots * 1000;

        setTimeout(() => {
          console.log(`Processed: ${content}`);
          channel.ack(msg);
        }, timeToProcess);
      }
    },
    { noAck: false }
  );
}

consumer().catch(console.error);
