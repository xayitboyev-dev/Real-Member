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
            const text = `<b>${about.type == "channel" ? "📣 KANAL" : "👥 GURUH"}</b>\n\n<b>Nomi:</b> <i>${about.title}</i>\n<b>Username:</b> <i>@${about.username}</i>\n<b>Id:</b> <i>${about.id}</i>\n\n<b>Kanalga a'zo bo'ling va 2 ta olmos oling!</b>`;
            resolve({ text, photo: about.photo.big_file_id, inline: taskInline(about.username, order.orderNumber, about.type) });
        } catch (error) {
            if (error.on) {
                await bot.telegram.sendMessage(order.customerId, `❗️ ${order.channel} kanali uchun ${order.count} ta obunachi buyurtmangiz bekor qilindi. Sababi qoidani buzgan bo'lishingiz mumkin. Eslatma, botni adminlikdan olish yoki kanalingiz username'sini o'zgartirsangiz buyurtma bekor qilinadi!`, { parse_mode: "HTML" });
                await order.deleteOne();
                task();
            };
        };
    };
    task();
});