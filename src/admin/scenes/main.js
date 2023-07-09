const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:main');
const { main } = require('../keyboards/keyboard');
const { cancelOrder } = require("../../keyboards/inline");
const auth = require("../middlewares/auth");
const User = require("../../models/User");
const Order = require("../../models/Order");

scene.enter(auth, async (ctx) => ctx.reply('🔝 Asosiy menyudasiz', main));

scene.hears("📤 Xabar tarqatish", (ctx) => ctx.scene.enter('admin:sendMessage', { type: "all" }));

scene.hears("👤 Userlar", (ctx) => ctx.scene.enter('admin:users'));

scene.hears("🏠 Client", (ctx) => ctx.scene.enter("main"));

scene.hears("📊 Statistika", async (ctx) => {
    const activeUsers = await User.find({ isActive: true });
    const nonActiveUsers = await User.find({ isActive: null || false });
    await ctx.replyWithHTML(`📊 Statistika\n\nActive userlar: <b>${activeUsers.length}</b>\nNonActive userlar: <b>${nonActiveUsers.length}</b>\nBarchasi: <b>${activeUsers.length + nonActiveUsers.length}</b>`);
});

scene.hears("📦 Buyurtmalar", async (ctx) => {
    const orders = await Order.find();
    if (orders.length) {
        for (const order of orders) {
            ctx.replyWithHTML(`🛍 <b>Buyurtma raqami:</b> <i>${order.orderNumber}</i>\n<b>📣 Kanal:</b> ${order.channel}\n<b>👥 Obunachi soni:</b> <i>${order.count}</i>\n<b>🆕 Qo'shilganlar</b> <i>${order.joined.length}</i>`, cancelOrder(order.orderNumber));
        };
    } else ctx.reply("📂 Hozircha hech qanday buyurtmalar yo'q!");
});

scene.action(/^cancel_order_(.+)$/, async (ctx) => {
    await Order.findOneAndDelete({ orderNumber: parseInt(ctx.match[1]) });
    ctx.answerCbQuery("Buyurtma bekor qilindi!");
    ctx.deleteMessage();
});

scene.use((ctx) => {
    ctx.reply("❗️ Kerakli bo'limni tanlang");
});

module.exports = scene;