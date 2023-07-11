const { Composer, Scenes: { WizardScene } } = require("telegraf");
const findMe = require("../utils/findMe");
const Order = require("../models/Order");
const User = require("../models/User");
const { finishOrder } = require("../keyboards/inline");
const { cancel } = require("../keyboards/keyboard");
const { EACH_MEMBERS_PRICE, MAX_ORDER, MIN_ORDER } = require("../config/config.json");
const bot = require("../core/bot");
const start = require("../utils/start");

const scene = new WizardScene('toOrder',
    async (ctx) => {
        const { balance } = await findMe(ctx);
        ctx.scene.state.canOrder = Math.floor(balance / EACH_MEMBERS_PRICE);
        const text = `Hisobingizda: ${balance} 💎\nMinimum buyurtma: ${MIN_ORDER}\nMaximum buyurtma: ${MAX_ORDER}\n\n👤 Harbir obunachi narxi ${EACH_MEMBERS_PRICE} olmos, hisobingiz ${ctx.scene.state.canOrder} ta obunachi buyurtma berish uchun yetarli!\n\n👥 Nechta obunachiga buyurtma bermoqchisiz, sonda kiriting.`
        await ctx.reply(text, cancel);
        ctx.scene.state.balance = balance;
        ctx.wizard.next();
    },
    async (ctx) => {
        if (ctx.message?.text == "🔝 Asosiy menyu") return start(ctx);
        const count = parseInt(ctx.message?.text);
        if (!count) return await ctx.reply("❗️ Iltimos faqat sonlarda kiriting");
        if (count < MIN_ORDER) return await ctx.reply(`❗️ Eng kamida ${MIN_ORDER} ta buyurtma berish mumkin`);
        if (count > MAX_ORDER) return await ctx.reply(`❗️ Eng ko'pida ${MAX_ORDER} ta buyurtma berish mumkin`);
        const price = count * EACH_MEMBERS_PRICE;

        if (price <= ctx.scene.state.balance) {
            ctx.scene.state.price = price;
            ctx.scene.state.count = count;
            await ctx.reply("Yaxshi, endi kanal yoki guruh usernamesini kiriting. Iltimos yuborishda namunada ko'rsatilganidek xatolarsiz yuboring.\n\nNamuna: @username");
            ctx.wizard.next();
        } else {
            await ctx.reply("❗️ Hisobingiz yetarli emas");
            return start(ctx);
        };
    },
    async (ctx) => {
        if (ctx.message?.text == "🔝 Asosiy menyu") return start(ctx);
        if ((ctx.message?.text).split(" ").length > 1 || ctx.message.text.indexOf("@") != 0) return ctx.reply("❗️ Iltimos username'ni namunadagidek to'g'ri kiriting");
        const link = ctx.message.text;
        try {
            const channel = await bot.telegram.getChat(link);
            ctx.scene.state.channel = channel;
            await ctx.reply(`✅ ${channel.type == "channel" ? "Kanal" : "Guruh"} topildi\nNomi: ${channel.title}\nUsername: @${channel.username}\nBuyurtma soni: ${ctx.scene.state.count}\n\n❗️ Qoida, buyurtma bajarilgunicha ${channel.type == "channel" ? "bot kanalingizda admin bo'lishi kerak! Va " : ""}agarda hozirgi username o'zgarsa buyurtma bekor qilinadi!\n\nUshbu ma'lumotlar to'gri bo'lsa "Tayyor" tugmasini bosing.`, finishOrder);
            ctx.wizard.next();
        } catch (error) {
            console.log(error);
            await ctx.reply("❗️ Kiritgan kanal yoki guruhingiz topilmadi!");
        };
    },
    Composer.action(/ready|cancel/gi, async (ctx) => {
        if (ctx.match[0] == "ready") {
            const channel = ctx.scene.state.channel;
            try {
                const admins = await bot.telegram.getChatAdministrators("@" + channel.username);
                const me = await findMe(ctx);
                // finish order
                const order = new Order({
                    channel: "@" + channel.username,
                    count: ctx.scene.state.count,
                    customer: me._id,
                    customerId: ctx.from.id,
                    orderNumber: Math.floor(Math.random() * 99999999999) + 3257934
                });
                order.save().then(async () => {
                    await User.findOneAndUpdate({ uid: ctx.from.id }, { $inc: { "balance": -Math.abs(ctx.scene.state.price) } });
                    ctx.deleteMessage();
                    await ctx.reply("✅ Buyurtma berildi.");
                    start(ctx);
                }).catch((error) => {
                    console.log(error);
                    ctx.deleteMessage();
                    ctx.reply("❗️ Nimadir xato ketdi, iltimos qaytadan urinib ko'ring!");
                    start(ctx);
                });
            } catch (error) {
                await ctx.answerCbQuery(`❗️ Botni kanalingizda admin qiling va tugmani qayta bosing`, { show_alert: true });
                console.log(error);
            };
        } else {
            await ctx.deleteMessage();
            start(ctx);
        };
    }),
);

module.exports = scene;