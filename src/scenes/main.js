const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('main');
const { shareReferral, cancelOrder } = require("../keyboards/inline");
const { main } = require("../keyboards/keyboard");
const start = require("../utils/start");
const Order = require("../models/Order");
const findMe = require("../utils/findMe");
const getChannel = require("../utils/getChannel");
const bot = require("../core/bot");
const { JOIN_INC, REFERRAL_INC, BOT_DESCRIPTION, EACH_MEMBERS_PRICE } = require("../config/config.json");
const User = require('../models/User');

scene.enter(async (ctx) => {
    try {
        if (ctx.scene.state.fromStart) {
            await ctx.replyWithHTML(BOT_DESCRIPTION);
        };
        await ctx.reply("🔝 Asosiy menyu", main);
    } catch (error) {
        console.log(error);
    };
});

scene.start(start);

scene.command("admin", async (ctx) => ctx.scene.enter("admin:main"));

scene.hears(["🚀 Olmos yig'ish", "/task"], async (ctx) => {
    try {
        const get = await getChannel(ctx);
        const imgLink = (await ctx.telegram.getFileLink(get.photo)).href;
        await ctx.replyWithPhoto({ url: imgLink }, { caption: get.text, parse_mode: "HTML", reply_markup: { inline_keyboard: get.inline } });
    } catch (error) {
        console.log(error);
    };
});

scene.hears("🛍 Buyurtma berish", async (ctx) => {
    ctx.scene.enter("toOrder");
});

scene.hears(["📦 Buyurtmalarim", "/orders"], async (ctx) => {
    try {
        const orders = await Order.find({ customerId: ctx.from.id }).populate("customer");
        if (orders.length) {
            for (const order of orders) {
                ctx.replyWithHTML(`🛍 <b>Buyurtma raqami:</b> <i>${order.orderNumber}</i>\n<b>📣 Kanal:</b> ${order.channel}\n<b>👥 Obunachi soni:</b> <i>${order.count}</i>\n<b>🆕 Qo'shilganlar</b> <i>${order.joined.length}</i>`, cancelOrder(order.orderNumber));
            };
        } else ctx.reply("📂 Hozircha hech qanday buyurtma bermagansiz!");
    } catch (error) {
        console.log(error);
    };
});

scene.hears(["👥 Referral", "/referral"], async (ctx) => {
    try {
        const me = await findMe(ctx);
        const totalEarn = me.referrals?.length * REFERRAL_INC;
        if (me) await ctx.replyWithHTML(`👥 Referral havolangiz orqali botga chaqirgan xar bir do'stingiz uchun ${REFERRAL_INC} olmos olasiz!\n\nSiz ${me.referrals?.length} ta do'stingizni taklif qilgansiz\nJami ${totalEarn} olmos ishlagansiz!`, shareReferral);
    } catch (error) {
        console.log(error);
    };
});

scene.hears(["❓ Yordam", "/help"], async (ctx) => {
    try {
        await ctx.reply("❓ Yordam\n\n🤖 Ushbu bot orqali telegramdagi kanal yoki guruhingizda faol o'zbek obunachilar ko'paytirib olishingiz mumkin, Har qanday savol yoki kelishuv uchun admin bilan bog'laning!\n\n🧑‍💻 @realadmin15");
    } catch (error) {
        console.log(error);
    };
});

scene.hears(["💎 Balans", "/balance"], async (ctx) => {
    try {
        const me = await findMe(ctx);
        if (me) await ctx.reply(`Balansingizda: ${me.balance} 💎\n\nKo'proq olmos ishlash uchun do'stlaringizni chaqirishingiz mumkin, hamda olmos ishlash bo'limida kanallarga a'zo bo'lib ham olmos ishlashingiz mumkin!\n\nBotdagi valyuta:\n1 ta obunachi = ${EACH_MEMBERS_PRICE} olmos\n1 ta referral = ${REFERRAL_INC} olmos\n1 ta kanalga a'zo bo'lish = ${JOIN_INC} olmos.`);
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

scene.action(/^joined_(.+)$/, async (ctx) => {
    try {
        const order = await Order.findOne({ orderNumber: parseInt(ctx.match[1]) });
        const isMember = await bot.telegram.getChatMember(order.channel, ctx.from.id);
        if (["administrator", "creator", "member"].includes(isMember?.status)) {
            if (order.joined.includes(ctx.from.id)) return ctx.answerCbQuery("Allaqachon a'zo bo'lgansiz ❗️", { show_alert: true });
            await User.findOneAndUpdate({ uid: ctx.from.id }, { $inc: { "balance": JOIN_INC } });
            order.joined.push(ctx.from.id);
            if (order.joined.length >= order.count) {
                await bot.telegram.sendMessage(order.customerId, `✅ ${order.orderNumber} raqamli buyurtmangiz bajarildi va ${order.channel} kanalingizga ${order.count} ta obunachi qo'shildi!`);
                await order.deleteOne();
            }
            else await order.save();
            ctx.answerCbQuery(`A'zo bo'ldingiz va sizga ${JOIN_INC}💎 berildi ✅`, { show_alert: true });
        } else {
            ctx.answerCbQuery("A'zo bo'lmagansiz ❗️", { show_alert: true });
        };
    } catch (error) {
        console.log("Joined button error");
        ctx.deleteMessage();
    };
});

scene.action("update", async (ctx) => {
    try {
        const get = await getChannel(ctx);
        ctx.answerCbQuery();
        const imgLink = (await ctx.telegram.getFileLink(get.photo)).href;
        await ctx.editMessageMedia({ media: { url: imgLink }, caption: get.text, parse_mode: "HTML", type: "photo" }, { reply_markup: { inline_keyboard: get.inline } });
    } catch (error) {
        // console.log(error);
    };
});

scene.on("callback_query", (ctx) => ctx.deleteMessage());

module.exports = scene;