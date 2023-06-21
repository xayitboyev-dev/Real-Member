const bot = require("../core/bot");
const Order = require("../models/Order");
const { task: taskInline } = require("../keyboards/inline");



module.exports = (ctx) => new Promise((resolve) => {
    function getRandom(to) {
        const val = Math.floor(Math.random() * to);
        if (val != ctx.session.oldRandom) {
            ctx.session.oldRandom = val
            return val
        }
        else return getRandom();
    };

    const task = async () => {
        const count = await Order.count();
        const order = await Order.findOne().skip(getRandom(count));

        try {
            const about = await bot.telegram.getChat(order.channel);
            await bot.telegram.getChatAdministrators(order.channel);
            const text = `${about.type} #${order.orderNumber}\n\nNomi: ${about.title}\nUsername: ${about.username}\nId: ${about.id}\nDescription: ${about.description}`;
            resolve({ text, photo: about.photo.big_file_id, inline: taskInline(about.username, order.orderNumber, about.type) });
        } catch (error) {
            if (error.on) {
                await order.deleteOne();
                task();
            };
        };
    };
    task();
});