const User = require("../models/User");
const bot = require("../core/bot");

exports.sendMessage = async (...args) => {
    const admins = await User.find({ role: "admin" });

    admins.forEach((admin) => {
        bot.telegram.sendMessage(admin.uid, ...args);
    });
};

exports.forwardMessage = async (ctx) => {
    const admins = await User.find({ role: "admin" });

    admins.forEach((admin) => {
        ctx.forwardMessage(admin.uid);
    });
};