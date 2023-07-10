const { Scenes: { BaseScene } } = require('telegraf');
const { register } = require("../keyboards/keyboard");
const User = require("../models/User");
const scene = new BaseScene('register');
const referral = require("../utils/referral");

scene.enter(async (ctx) => {
    ctx.reply("☎️ Telefon raqamingizni kiriting", register);
});

scene.start((ctx) => ctx.scene.enter("register", { startPayload: ctx.startPayload }));

scene.on("contact", async (ctx) => {
    const phone = ctx.message?.contact?.phone_number;
    if (ctx.message?.contact?.user_id == ctx.from.id) {
        await User.findOneAndUpdate({ uid: ctx.from.id }, { phone });
        const { startPayload } = ctx.scene.state;
        if (startPayload) referral(parseInt(startPayload), ctx.from.id, ctx.from.username);
        ctx.scene.enter("main", { fromStart: true });
    } else {
        ctx.reply("❗️ Faqat o'zingizning telefon raqamingizni kirita olasiz");
    };
});

scene.on("callback_query", (ctx) => ctx.deleteMessage());

scene.use((ctx) => ctx.reply(`❗️ Pasdagi "telefon raqamni yuborish" tugmasi orqali yuboring`));

module.exports = scene;