const { REFERRAL_TEXT } = require("../config/config.json");
const { enterToBot } = require("../keyboards/inline");
const bot = require("../core/bot");

bot.on("inline_query", async (ctx) => {
    console.log(ctx.inlineQuery.query);
    await ctx.answerInlineQuery([{ title: "Real Members!", reply_markup: { inline_keyboard: enterToBot(ctx.botInfo.username, ctx.from?.id) }, parse_mode: "HTML", caption: REFERRAL_TEXT, type: "photo", id: 213, thumb_url: "https://app.rigi.club/wp-content/uploads/2022/09/Telegram-Paid.png", photo_url: "https://app.rigi.club/wp-content/uploads/2022/09/Telegram-Paid.png" }]);
});