const sql = require('mssql');
const config = {
    user: process.env.USERNAME, // better stored in an app setting such as process.env.DB_USER
    password: process.env.PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
    server: process.env.SERVER, // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: process.env.DATABASE, // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

console.log("Starting...");

async function createOrder(body, shipping, allOrders) {
    try {
        var pool = await sql.connect(config);
        const request = pool.request()
        request.input('email', sql.VarChar, shipping.name)
        console.log(shipping)
        request.input('shipping', sql.VarChar, `${shipping.address} ${shipping.city} ${shipping.state} ${shipping.postalCode} ${shipping.country}`)
        request.input('orders', sql.VarChar, allOrders)
        request.input('payment', sql.VarChar, `${body.amount}`)
        const currentDate = new Date();
        request.input('time', sql.Date, currentDate)
        const resultSet = await request.query('insert into Orders (email, shipping, orders, payment, orderDate, completed) values (@email, @shipping, @orders, @payment, @time, 0)')
        return 'Success'
    } catch (err) {
        console.error(err.message);
    }
}

async function getOrders() {
    try {
        var pool = await sql.connect(config);
        const request = pool.request()
        const resultSet = await request.query('select * from Orders where completed = 0 order by orderDate desc')
        console.log(resultSet['recordsets'])
        return resultSet['recordsets'][0]
    } catch (err) {
        console.error(err.message);
    }
}

async function getCompletedOrders() {
    try {
        var pool = await sql.connect(config);
        const request = pool.request()
        const resultSet = await request.query('select * from Orders where completed = 1 order by orderDate desc')
        console.log(resultSet['recordsets'])
        return resultSet['recordsets'][0]
    } catch (err) {
        console.error(err.message);
    }
}

async function completeOrder(orderId){
    try {
        var pool = await sql.connect(config);
        const request = pool.request()
        request.input('orderId', sql.Int, orderId)
        const resultSet = await request.query('update Orders set completed = 1 where orderId = @orderId')
        return 'success'
    } catch(err) {
        console.error(err.message)
    }
}

module.exports = {createOrder, getOrders, getCompletedOrders, completeOrder}