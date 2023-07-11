const { Telegraf, session } = require("telegraf");
const { BOT_TOKEN } = require("../config/config.json");

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.telegram.setMyCommands([{ command: "/start", description: "Botni yangilash" }, { command: "/balance", description: "Balansingizni ko'rish" }, { command: "/referral", description: "Referral tizimi" }, { command: "/task", description: "Olmos ishlash" }, { command: "/orders", description: "Buyurtmalaringizni kuzatish" }, { command: "/shopping", description: "Olmos sotib olish" }, { command: "/help", description: "Yordam" }]);
bot.catch((err) => console.log(err));

module.exports = bot;