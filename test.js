const { Telegraf } = require("telegraf");
const bot = new Telegraf("5764559035:AAE6l_UW0BMddiG44-fk4xyKoBfyLo35FTY");

bot.use((ctx) => {
    ctx.reply("Hello World!");
});

async function sendd(chatId) {
    const user = await bot.telegram.getChat(chatId);
    console.log(user.title);
    bot.telegram.sendMessage(user.id, "TEST");
};

sendd("@nodejs_community");

bot.launch();
console.log("Started");