const { Telegraf, session } = require("telegraf");
const { BOT_TOKEN } = require("../config/config.json");

const bot = new Telegraf(BOT_TOKEN);

bot.use(session());
bot.use((ctx, next) => { if (ctx.from?.id) next(); });
bot.telegram.setMyCommands([{ command: "/start", description: "Botni yangilash" }]);
bot.catch((err) => console.log(err));

module.exports = bot;