const express = require('express');
const cors = require('cors')


const app = express();
const {login, signup} = require('./database/sql')
app.use(express.json());
app.use(cors())
app.post('/signup', async (req, res) => {
  try {
    const {email, password} = req.body
    const accessToken = await signup(email, password) 
    console.log(accessToken)
    res.status(201).json({"token": accessToken})
  } catch(err) {
    res.status(500).json({"msg": "Try again in a few minutes"})
  }
});

 
app.post('/signin', async (req, res) => {
  try {
    const {email, password} = req.body

    const {accessToken, userrole} = await login(email, password)
    console.log(accessToken)
    res.status(200).json({"token": accessToken, "userrole": userrole})
  } catch(err) {
    res.status(500).json({"msg": "Try again in a few minutes"})
  }
});




app.listen(3002, () => {
  console.log('Order service listening on port 3002');
});
