const { Telegraf, session } = require("telegraf");
const { BOT_TOKEN } = require("../config/config.json");

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use((ctx, next) => {
    if (ctx.from?.id && !["supergroup", "channel", "group"].includes(ctx.chat?.type)) next();
    else console.log("bot can't send message to channel or group!");
});
bot.telegram.setMyCommands([{ command: "/start", description: "Botni yangilash" }, { command: "/balance", description: "Balansingizni ko'rish" }, { command: "/referral", description: "Referral tizimi" }, { command: "/task", description: "Olmos ishlash" }, { command: "/orders", description: "Buyurtmalaringizni kuzatish" }, { command: "/help", description: "Yordam" }]);
bot.catch((err) => console.log(err));

module.exports = bot;