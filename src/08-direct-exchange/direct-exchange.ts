import amqp from "amqplib";

interface OrderEvent {
  id: number;
  customer: string;
  event: string;
}

async function SendOrderEvents() {
  const connection = await amqp.connect("amqp://admin:admin@localhost:5672");
  const channel = await connection.createChannel();

  const exchange = "amq.direct";

  const ordersEvent: OrderEvent[] = [
    { id: 1, customer: "John Doe", event: "order.created" },
    { id: 2, customer: "Jane Doe", event: "order.updated" },
    { id: 3, customer: "John Smith", event: "order.deleted" },
  ];

  for (const order of ordersEvent) {
    const routingKey = order.event;
    const message = JSON.stringify(order);
    channel.publish(exchange, routingKey, Buffer.from(message));
  }

  setTimeout(() => {
    channel.close();
    connection.close();
  }, 500);
}

SendOrderEvents().catch(console.error);
