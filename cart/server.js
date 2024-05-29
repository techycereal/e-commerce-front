const express = require('express');
const cors = require('cors')
const {addToCart, editCart, getCart, removeCart, deletedProduct, getCartCount} = require('./database/mongo_cart')
const {authenticate} = require('./middlewares/middleware')
const app = express();
app.use(express.json());
app.use(cors())
app.post('/add', authenticate, async (req, res) => {
    try {
        const user = req.user
        const body = req.body
        await addToCart(body, user)
        res.status(201).send('result');
    }
    catch(err) {
        res.status(500).send(err);
    }
});

app.post('/edit', async (req, res) => {
    try {
        const body = req.body
        const result = await editCart(body)
        res.status(201).send(result);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

app.post('/remove', authenticate, async (req, res) => {
    try {
        const body = req.body
        const userId = req.user.userId
        const result = await removeCart(body, userId)
        res.status(201).send(result);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

app.post('/deletedproduct', async (req, res) => {
    try {
        const body = req.body
        const result = await deletedProduct(body)
        res.status(201).send(result);
    }
    catch(err) {
        res.status(500).send(err);
    }
});

app.get('/mycart', authenticate, async (req, res) => {
    try {
        const user = req.user
        const result = await getCart(user.userId)
        res.status(201).send(result);
    } catch(err) {
        res.status(500).send(err);
    }
});


app.get('/cartcount', authenticate, async (req, res) => {
    try {
        const user = req.user
        const result = await getCartCount(user.userId)
        res.status(201).send(`${result}`);
    } catch(err) {
        console.log(err)
        res.status(500).send(err);
    }
});

app.listen(3004, () => {
  console.log('Order service listening on port 3003!!');
});
