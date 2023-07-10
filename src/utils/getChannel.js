const bot = require("../core/bot");
const Order = require("../models/Order");
const { task: taskInline } = require("../keyboards/inline");

module.exports = (ctx, msg) => new Promise((resolve) => {
    function getRandom(to) {
        if (to <= 1) return 0;
        const val = Math.floor(Math.random() * to);
        if (val != ctx.session.oldRandom) {
            ctx.session.oldRandom = val
            return val
        }
        else return getRandom(to);
    };

    const task = async () => {
        const orders = await Order.find({ joined: { "$ne": ctx.from.id } });
        const order = orders[getRandom(orders.length)];
        // const count = await Order.count();
        // const order = await Order.findOne().skip(getRandom(count));

        try {
            if (!order) {
                if (!msg) await ctx.deleteMessage();
                return await ctx.reply("📂 Hozircha hech qanday vazifalar yo'q!");
            };
            const about = await bot.telegram.getChat(order.channel);
            await bot.telegram.getChatAdministrators(order.channel);
            const text = `<b>${about.type == "channel" ? "📣 KANAL" : "👥 GURUH"}</b>\n\n<b>Nomi:</b> <i>${about.title}</i>\n<b>Username:</b> <i>@${about.username}</i>\n<b>Id:</b> <i>${about.id}</i>\n\n<b>Kanalga a'zo bo'ling va 2 ta olmos oling!</b>`;
            resolve({ text, photo: about.photo.big_file_id, inline: taskInline(about.username, order.orderNumber, about.type) });
        } catch (error) {
            console.log(error);
            if (error.on) {
                await bot.telegram.sendMessage(order.customerId, `❗️ ${order.channel} kanali uchun ${order.count} ta obunachi buyurtmangiz bekor qilindi. Sababi qoidani buzgan bo'lishingiz mumkin. Eslatma, botni adminlikdan olish yoki kanalingiz username'sini o'zgartirsangiz buyurtma bekor qilinadi!`, { parse_mode: "HTML" });
                await order.deleteOne();
                task();
            };
        };
    };
    task();
});