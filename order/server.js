const express = require('express');
const cors = require('cors')
const {authenticate} = require('./middlewares/middleware')
const {getAllProducts, getProduct,editProduct, deleteProduct, addProduct} = require('./database/mongo_prod')
const app = express();
app.use(express.json());
app.use(cors())
const { ServiceBusClient } = require('@azure/service-bus');
const connectionString = process.env.SERVICE_BUS_CONNECTION;
const queueName = process.env.QUEUE_NAME;
const sbClient = new ServiceBusClient(connectionString);
const sender = sbClient.createSender(queueName);
app.post('/allProducts', authenticate, async (req, res) => {
    try {
        const {start, end} = req.body
        const result = await getAllProducts(start, end)
        if (req.user.userrole == 1) {
            res.status(201).send({data: result, ability: 'edit'});    
        } else {
            res.status(201).send({data: result, ability: 'no edit'});    
        }
    } catch(err) {
        res.status(500).send("I'm sorry we ran into some problems")
    }
});


app.post('/product/edit', authenticate, async (req, res) => {
    try {
        const body = req.body
        const result = await editProduct(body)
        const message = { ...body, event: 'edit product' };
        await sender.sendMessages({ body: message });
        res.status(201).send(result);
    } catch(err) {
        res.status(500).send("I'm sorry we're running into some problems");
    }
    
});


app.post('/product/add', authenticate, async (req, res) => {
    try {
        const body = req.body
        const result = await addProduct(body)
        res.status(201).send(result);
    } catch(err) {
        res.status(500).send("I'm sorry we're facing some difficulties");
    }
});


app.post('/product/delete', authenticate, async (req, res) => {
    try {
        const body = req.body
        const result = await deleteProduct(body.id)
        const message = { ...body, event: 'delete product' };
        await sender.sendMessages({ body: message });
        res.status(201).send(result);
    } catch(err) {
        res.status(500).send("I'm sorry we're facing some difficulties");
    }
});

app.get('/product/:id', authenticate, async (req, res) => {
    try {
        const prodId = req.params.id
        const result = await getProduct(prodId)
        res.status(201).send(result);
    } catch(err) {
        res.status(500).send("I'm sorry we're facing some difficulties");
    }
});



app.listen(3003, () => {
  console.log('Order service listening on port 3003');
});
