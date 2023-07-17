const User = require("../models/User");
const bot = require("../core/bot");

exports.sendMessage = async (...args) => {
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
        await bot.telegram.sendMessage(admin.uid, ...args);
    };
};

exports.sendDocument = async (...args) => {
    const admins = await User.find({ role: "admin" });
    for (const admin of admins) {
        await bot.telegram.sendDocument(admin.uid, ...args);
    };
};

exports.forwardMessage = async (ctx) => {
    const admins = await User.find({ role: "admin" });
    console.log(admins)
    admins.forEach((admin) => {
        ctx.forwardMessage(admin.uid);
    });
};