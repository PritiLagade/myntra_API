//user API
//get all users
const express = require("express");
const router = require('./router.js');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.use('/router', router);
 app.listen(3000, () => {
      console.log("Server Started");
    });