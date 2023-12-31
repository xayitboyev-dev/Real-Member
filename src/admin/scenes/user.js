const { Scenes: { BaseScene } } = require('telegraf');
const User = require('../../models/User');
const Order = require("../../models/Order");
const { userKeyboard } = require("../keyboards/keyboard");
const { cancelOrder } = require("../../keyboards/inline");
const auth = require("../middlewares/auth");
const scene = new BaseScene('admin:user');
const { encode } = require("html-entities");

scene.enter(auth, async (ctx) => {
    const user = await User.findOne({ uid: ctx.scene?.state?.uid });
    ctx.scene.state.user = user;
    ctx.replyWithHTML(`User: <a href="tg://user?id=${user.uid}">${encode((user.first_name || user.first_name))}</a>`, userKeyboard);
});

scene.command("admin", (ctx) => ctx.scene.enter("admin:main"));

scene.hears("◀️ Orqaga", (ctx) => {
    ctx.scene.enter('admin:users');
});

scene.hears("💎 Balans", (ctx) => ctx.scene.enter('admin:user:balance', { uid: ctx.scene.state.uid }));

scene.hears("📤 Xabar yuborish", (ctx) => ctx.scene.enter('admin:sendMessage', { id: ctx.scene.state.uid }));

scene.hears("👤 Profile", async (ctx) => {
    const { user } = ctx.scene.state;
    const orders = await Order.find({ customerId: user.uid });
    ctx.replyWithHTML(`👤 Profile\n\nName: ${encode(user.first_name || user.last_name)}\nUsername: ${"@" + (user.username || "null")}\nBalance: ${user.balance}\nReferrals: ${user.referrals.length}\nRole: ${user.role}\nOrders: ${orders.length}\nId: ${user.uid}\nOfferer: <a href="tg://user?id=${user.offerer}">${user.offerer}</a>`);
});

scene.hears("👥 Referrals", async (ctx) => {
    try {
        console.log(ctx.scene?.state?.uid);
        const user = await User.findOne({ uid: ctx.scene?.state?.uid });
        const list = user.referrals.map((referral, index) => `${index + 1}) <a href = "tg://user?id=${referral}" >${referral}</a>`).join("\n");
        if (user) await ctx.replyWithHTML(`👥 Referrallar soni: ${user.referrals?.length} !\n\n${list} `);
    } catch (error) {
        console.log(error);
    };
});

scene.hears("📦 Buyurtmalar", async (ctx) => {
    try {
        const orders = await Order.find({ customerId: ctx.scene?.state?.uid });
        if (orders.length) {
            for (const order of orders) {
                ctx.replyWithHTML(`🛍 <b>Buyurtma raqami:</b> <i>${order.orderNumber}</i>\n < b >📣 Kanal:</ > ${order.channel} \n < b >👥 Obunachi soni:</ > <i>${order.count}</i>\n < b >🆕 Qo'shilganlar</> <i>${order.joined.length}</i>`, cancelOrder(order.orderNumber));
            };
        } else ctx.reply("📂 Hozircha hech qanday buyurtma bermagan!");
    } catch (error) {
        console.log(error);
    };
});

scene.action(/^cancel_order_(.+)$/, async (ctx) => {
    try {
        await Order.findOneAndDelete({ orderNumber: parseInt(ctx.match[1]) });
        ctx.answerCbQuery("Buyurtma bekor qilindi!");
        ctx.deleteMessage();
        console.log("Order deleted: " + ctx.match[1]);
    } catch (error) {
        console.log(error);
    };
});

scene.use((ctx) => {
    ctx.reply("❗️ Kerakli bo'limni tanlang");
});

module.exports = scene;