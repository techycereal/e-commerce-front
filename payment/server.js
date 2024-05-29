const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const {createOrder, getOrders, getCompletedOrders, completeOrder} = require('./database/orders_sql')
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/api/payment-intent', async (req, res) => {
    try {
        console.log(req.body)
        console.log('req.body')
        const { amount } = req.body;
      
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: 'usd',
        });
        return res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: error });
      }
});

app.post('/api/complete', async (req, res) => {
    try {
        console.log(req.body)
        const orders = req.body.orders
        const allOrders = orders.join(',')

        createOrder(req.body, req.body.shipping, allOrders)
        return res.json({ msg: 'Success' });
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: error });
      }
});

app.get('/api/orders', async (req, res) => {
    try {
        const result = await getOrders()
        return res.json(result);
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: error });
      }
});

app.get('/api/completedorders', async (req, res) => {
    try {
        const result = await getCompletedOrders()
        return res.json(result);
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: error });
      }
});

app.post('/api/completed', async (req, res) => {
    try {
        console.log(req.body)
        const orderId = req.body.id

        const test = await completeOrder(orderId)
        return res.json({ msg: 'Success' });
      } catch (error) {
        console.log(error)
          return res.status(500).json({ error: error });
      }
});

app.listen(3007, () => {
  console.log('Local server is running on port 3006');
});
