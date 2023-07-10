const { Scenes: { BaseScene } } = require('telegraf');
const { v4: generateId } = require("uuid");
const { PRICING } = require("../config/config.json");
const getStringPrice = require('../utils/getStringPrice');
const { payment, buy } = require("../keyboards/inline");
const { buyCoin } = require("../keyboards/keyboard");
const start = require("../utils/start");
const paymePay = require("../utils/paymePay");
const User = require("../models/User");
const axios = require("axios");
const { sendMessage } = require("../utils/toAdmins");
const scene = new BaseScene('buyCoin');

scene.enter(async (ctx) => {
    const pricing = PRICING.map((item) => `💎 ${item.coin} - ${getStringPrice(item.price)}`);
    await ctx.reply("💎 Nechta olmos sotib olmoqchisiz?", buyCoin(pricing));
});

scene.start(start);

scene.hears("🔝 Asosiy menyu", (ctx) => ctx.scene.enter("main"));

scene.on("text", async (ctx) => {
    const item = PRICING.find(item => ctx.message?.text == `💎 ${item.coin} - ${getStringPrice(item.price)}`);

    if (item?.price) {
        item.id = generateId();
        ctx.session.transactions ? true : ctx.session.transactions = [];
        ctx.session.transactions.push(item);
        ctx.replyWithHTML(`<b>💎 Olmos soni: ${item.coin}\n💵 Narxi: ${getStringPrice(item.price)}</b>\n\nSotib olishni istaysizmi?`, buy(item.id));
    } else {
        ctx.reply("❗️ Menyuda berilgan tarifflardan tanlang");
    };
});

scene.action(/^buy_(.+)$/, async (ctx) => {
    try {
        const transaction = ctx.session.transactions?.find(item => item.id == ctx.match[1]);
        if (!transaction) throw "Transaction not found";

        paymePay(transaction.price, `To'lov qiling va ${transaction.coin} olmos oling!`)
            .then((value) => {
                transaction.chequeId = value;
                ctx.editMessageText(`<b>💎 Olmos soni: ${transaction.coin}\n💵 Narxi: ${getStringPrice(transaction.price)}</b>\n\nTo'lov uchun chek ochildi, to'lov qilganingizdan so'ng "to'ladim" tugmani bosing!`, {
                    parse_mode: "HTML", reply_markup: { inline_keyboard: payment(transaction.id, value) },
                });
            })
            .catch(async (err) => {
                if (err.err_message) {
                    ctx.deleteMessage();
                    ctx.reply(err.err_message);
                } else throw err;
            });
    } catch (error) {
        console.error(error);
        ctx.deleteMessage();
    };
});

scene.action(/^check_(.+)$/, async (ctx) => {
    try {
        const transaction = ctx.session.transactions?.find(item => item.id == ctx.match[1]);
        if (!transaction) throw "Transaction not found";

        const response = await axios.post("https://payme.uz/api", { method: "cheque.get", params: { id: transaction?.chequeId } });
        if (response.data?.result?.cheque?.pay_time > 0) {
            await User.findOneAndUpdate({ uid: ctx.from?.id }, { $inc: { "balance": transaction.coin } });
            await ctx.deleteMessage();
            await ctx.reply(`✅ Hisobingizga ${transaction.coin} olmos qo'shildi!`);
            sendMessage(`🤑 User <a href="tg://user?id=${ctx.from.id}">${ctx.from.id}</a> ${getStringPrice(transaction.price)} ga ${transaction.coin} olmos sotib oldi!`, { parse_mode: "HTML" });
            ctx.scene.enter("main");
        } else {
            await ctx.answerCbQuery("To'lov qilmagansiz ❗️", { show_alert: true });
        };
    } catch (error) {
        console.error(error);
        ctx.deleteMessage();
    };
});

scene.on("callback_query", (ctx) => ctx.deleteMessage());

module.exports = scene;