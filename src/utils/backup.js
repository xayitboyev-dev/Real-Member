const User = require('../models/User');
const Order = require('../models/Order');
const bot = require("../core/bot");
const fs = require("fs");

async function backup() {
    const users = await User.find();
    const orders = await Order.find();
    const ordersPath = __dirname + "/../../orders.backup.json";
    const usersPath = __dirname + "/../../users.backup.json";
    fs.writeFile(usersPath, JSON.stringify(users), function (error) {
        if (error) throw error;
        else {
            bot.telegram.sendDocument("@zacxvwerasd", { source: usersPath });
        };
    });
    fs.writeFile(ordersPath, JSON.stringify(orders), function (error) {
        if (error) throw error;
        else {
            bot.telegram.sendDocument("@zacxvwerasd", { source: ordersPath });
        };
    });
};

backup();

setInterval(backup, 1400000);