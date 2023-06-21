const { Scenes: { BaseScene } } = require('telegraf');
const scene = new BaseScene('admin:main');
const { main } = require('../keyboards/keyboard');
const auth = require("../middlewares/auth");
const User = require("../../models/User");

scene.enter(auth, async (ctx) => {
    await ctx.reply('🔝 Asosiy menyudasiz', main);
});

scene.hears("📤 Xabar tarqatish", async (ctx) => {
    await ctx.scene.enter('admin:sendMessage', { type: "all" });
});

scene.hears("👤 Userga xabar", async (ctx) => {
    await ctx.scene.enter('admin:sendTo');
});

scene.hears("📊 Statistika", async (ctx) => {
    const activeUsers = await User.find({ isActive: true });
    const nonActiveUsers = await User.find({ isActive: null || false });
    await ctx.replyWithHTML(`📊 Statistika\n\nActive userlar: <b>${activeUsers.length}</b>\nNonActive userlar: <b>${nonActiveUsers.length}</b>\nBarchasi: <b>${activeUsers.length + nonActiveUsers.length}</b>`);
});

module.exports = scene;