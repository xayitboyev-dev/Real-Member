const bot = require("../core/bot");
const Order = require("../models/Order");
const { JOIN_INC } = require("../config/config.json");
const { task: taskInline } = require("../keyboards/inline");
const { encode } = require("html-entities");

function getRandom(to) {
        if (to <= 1) return 0;
        const val = Math.floor(Math.random() * to);
        if (val != ctx.session.oldRandom) {
            ctx.session.oldRandom = val
            return val
        }
        else return getRandom(to);
};

module.exports = (ctx, msg) => new Promise((resolve) => {    
    async function task() {
        const orders = await Order.find({ joined: { "$ne": ctx.from?.id } });
        const order = orders[getRandom(orders.length)];
        // const count = await Order.count();
        // const order = await Order.findOne().skip(getRandom(count));

        try {
            if (!order) {
                if (!msg) await ctx.deleteMessage();
                return await ctx.reply("📂 Hozircha hech qanday vazifalar yo'q!");
            };
            const about = await bot.telegram.getChat(order.channel);
            const admins = await bot.telegram.getChatAdministrators(order.channel);
            const admin = admins.find((admin) => admin.user?.username == ctx.botInfo?.username);
            if (admin && admin.can_invite_users) {
                const text = `<b>${about.type == "channel" ? "📣 KANAL" : "👥 GURUH"}</b>\n\n<b>Nomi:</b> <i>${encode(about.title)}</i>\n<b>Username:</b> <i>@${about.username}</i>\n<b>Id:</b> <i>${about.id}</i>\n\n<b>Kanalga a'zo bo'ling va ${JOIN_INC} ta olmos oling!</b>`;
                let imgLink;
                if (about.photo?.big_file_id) {
                    // imgLink = (await bot.telegram.getFileLink(about.photo?.big_file_id)).href;
                };
                resolve({ text, photo: imgLink || __dirname + "/../assets/default_image.jpg", inline: taskInline(about.username, order.orderNumber, about.type) });
            } else throw "Is not a admin!";
        } catch (error) {
            if (error) {
                await Order.findOneAndDelete({ orderNumber: order.orderNumber });
                bot.telegram.sendMessage(order.customerId, `❗️ ${order.channel} kanali uchun ${order.count} ta obunachi buyurtmangiz bekor qilindi. Sababi qoidani buzgan bo'lishingiz mumkin. Eslatma, botni adminlikdan olish yoki kanalingiz username'sini o'zgartirsangiz buyurtma bekor qilinadi!`, { parse_mode: "HTML" });
                task();
            };
        };
    };
    task();
});
