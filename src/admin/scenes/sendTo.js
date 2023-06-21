const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:sendTo');
const { cancel } = require('../../keyboards/keyboard');
const auth = require("../middlewares/auth");
const User = require('../../models/User');

scene.enter(auth, async (ctx) => {
    ctx.reply('🆔 Kimga xabar yubormoqchisiz? Id raqamini yuboring', cancel);
});

scene.hears("🔝 Asosiy menyu", (ctx) => {
    ctx.scene.enter('admin:main');
});

scene.on("text", async (ctx, next) => {
    const id = parseInt(ctx.message.text);
    if (id) {
        const user = await User.findOne({ uid: id });
        if (user) {
            ctx.scene.enter("admin:sendMessage", { id });
        } else {
            ctx.reply("❗️ User topilmadi");
        };
    } else {
        next();
    };
});

scene.use((ctx) => {
    ctx.reply("❗️ Faqat raqamlardan iborat bo'lgan ID yuboring");
});

module.exports = scene;