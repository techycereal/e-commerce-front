const express = require('express');
const cors = require('cors');
const { ServiceBusClient } = require('@azure/service-bus');
const axios = require('axios');

const connectionString = process.env.SERVICE_BUS_CONNECTION;
const queueName = process.env.QUEUE_NAME;

const sbClient = new ServiceBusClient(connectionString);
const receiver = sbClient.createReceiver(queueName);
const app = express();
app.use(express.json());
app.use(cors());

receiver.subscribe({
  processMessage: async (message) => {
    try {
      const order = message.body;
      console.log(order);

      if (order.event === 'edit product') {
        order['pic'] = order.url
        await axios.post('http://cart-service/edit', order);
      } else if (order.event === 'delete product') {
        await axios.post('http://cart-service/deletedproduct', order);
      }

      // Complete the message so it is removed from the queue
      await receiver.completeMessage(message);
    } catch (err) {
      console.error('Error processing message:', err);
      // Handle the error, possibly with retries
    }
  },
  processError: async (error) => {
    console.error('Error processing message:', error);
  },
});

app.listen(3001, () => {
  console.log('Consumer service listening on port 3001 again');

});