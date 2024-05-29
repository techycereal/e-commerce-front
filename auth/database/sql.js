const sql = require('mssql');
const argon2 = require('argon2')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const secureCompare = require('secure-compare')
const access = process.env.SECRET_KEY
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

async function login(username, password) {
    try {
        var pool = await sql.connect(config);
        const request = pool.request()
        
        request.input('email', sql.VarChar, username)
        const resultSet = await request.query('SELECT * FROM Users where email = @email')
        const result = resultSet['recordset'][0]
        if (result.email) {
            //if (secureCompare(result.password, ))
            const salt = Buffer.from(result.salt, 'hex')
            const hashedPassword = await argon2.hash(password, {salt: salt})
            console.log(hashedPassword)
            console.log(result.passwords)

            if (secureCompare(result.passwords, hashedPassword)) {
                const message = {
                    userId: result.userId,
                    email: result.email,
                    userrole: result.userrole
                }
                const accessToken = jwt.sign(message, access)
                return {accessToken, userrole: result.userrole}
            }
            
            console.log('This is the hashed password: ' + hashedPassword)
        } else {
            return 'Invalid email or password'
        }
        
    } catch (err) {
        console.error(err.message);
    }
}

async function signup(email, password) {
    try {
        var pool = await sql.connect(config);
        const request = pool.request()
        const salt = crypto.randomBytes(16)
        const hashedPass = await argon2.hash(password, {salt: salt})
        request.input('email', sql.VarChar, email)
        request.input('password', sql.VarChar, hashedPass)
        request.input('salt', sql.VarChar, salt.toString('hex'))

        await request.query('insert into Users (email, passwords, salt) values (@email, @password, @salt)')
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {login, signup}