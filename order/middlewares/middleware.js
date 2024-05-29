const access = process.env.SECRET_KEY
const jwt = require('jsonwebtoken')

function authenticate(req, res, next){
    console.log(req.headers['authorization'])
    const token = req.headers['authorization']
    const accessToken = token.split(' ')[2]
    jwt.verify(accessToken, access, (err, user) => {
      req.user = user
      next()
    })
}

module.exports = {authenticate}