const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:user:balance');
const { cancel } = require('../../keyboards/keyboard');
const auth = require("../middlewares/auth");
const User = require('../../models/User');

scene.enter(auth, async (ctx) => {
    const user = await User.findOne({ uid: ctx.scene.state.uid });
    ctx.scene.state.user = user;
    ctx.reply(`💎 Hisobiga necha olmos qo'shmoqchisiz? Sonda kiriting\n\nHozir hisobida: ${user.balance} 💎`, cancel);
});

scene.hears("🔝 Asosiy menyu", (ctx) => {
    ctx.scene.enter('admin:user', { uid: ctx.scene.state?.user?.uid });
});

scene.on("text", async (ctx, next) => {
    const count = parseInt(ctx.message?.text);
    const id = ctx.scene.state?.uid;

    try {
        if (count) {
            if (id) {
                const { user } = ctx.scene.state;
                if (user) {
                    await User.findOneAndUpdate({ uid: user.uid }, { $inc: { "balance": count } });
                    const positive = count >= 0;
                    await ctx.replyWithHTML(`<a href='tg://user?id=${user.uid.toString()}'>Foydalanuvchi</a> hisobi${positive ? "ga" : "dan"} <i>${count.toString()}</i> olmos ${positive ? "qo'shildi" : "ayirildi"}.`);
                    ctx.scene.enter("admin:user", { uid: user.uid });
                } else ctx.reply("❗️ User topilmadi");
            } else ctx.scene.enter("admin:main");
        } else next();
    } catch (error) {
        console.log(error);
    };
});

scene.use((ctx) => {
    ctx.reply("❗️ Faqat sonlarda kiriting");
});

module.exports = scene;