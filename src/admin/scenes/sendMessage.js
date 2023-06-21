const { Scenes: { BaseScene } } = require('telegraf');
const { cancel } = require('../../keyboards/keyboard');
const scene = new BaseScene('admin:sendMessage');
const User = require('../../models/User');
const auth = require('../middlewares/auth');
const updateUser = require('../../utils/updateUser');

scene.enter(auth, async (ctx) => {
    await ctx.reply("📝 Xabaringizni yuboring:", cancel);
});

scene.hears('🔝 Asosiy menyu', async (ctx) => {
    await ctx.scene.enter('admin:main');
});

scene.on('message', async (ctx) => {
    if (ctx.scene.state.type == 'all') {
        let totalSents = 0;
        const users = await User.find({ isActive: true });
        if (users.length) {
            for await (const item of users) {
                try {
                    await ctx.copyMessage(item.uid);
                    totalSents++;
                } catch (err) {
                    updateUser(item.uid, { isActive: false });
                };
            };
        };
        await ctx.reply(`✅ ${totalSents} kishiga xabar yuborildi`);
        await ctx.reply("📝 Yana yozishingiz mumkin:", cancel);
    } else {
        try {
            await ctx.copyMessage(ctx.scene.state.id);
            await ctx.reply('✅ Xabar yuborildi');
            await ctx.reply("📝 Yana yozishingiz mumkin:", cancel);
        } catch (err) {
            await ctx.reply(err.description);
            switch (err.description) {
                case "Forbidden: bot was blocked by the user":
                    updateUser(ctx.scene.state.id, { isActive: false });
                    break;
                case "Bad Request: chat not found":
                    updateUser(ctx.scene.state.id, { isActive: false });
                    break;
                case "Too Many Requests: retry after 5":
                    console.log("retry after 5");
                    break;
                default:
                    console.log(err);
                    break;
            };
        };
    };
});

module.exports = scene;