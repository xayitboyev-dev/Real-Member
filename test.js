const connect = require('./src/helper/connectDb');
const fs = require("fs");
const User = require('./src/models/User');
const Order = require('./src/models/Order');
const bot = require('./src/core/bot');
const toAdmins = require('./src/utils/toAdmins');

async function find() {
    await connect();
    console.log("Connected to database");
  
};

find();

process.on('unhandledRejection', (err) => { console.log(err) });