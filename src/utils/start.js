const User = require("../models/User");
const updateUser = require("./updateUser");
const { sendMessage } = require("./toAdmins");
const { main } = require("../keyboards/keyboard");

module.exports = async (ctx) => {
    console.log("/start");
    ctx.scene.leave();
    try {
        const user = await User.findOne({ uid: ctx.from?.id });
        if (user) {
            if (user.phone) throw "User already";
            else {
                ctx.scene.enter("register", { startPayload: ctx.startPayload });
            };
        } else {
            await User.create({ ...ctx.from, uid: ctx.from?.id });
            sendMessage(`#newuser <code>${ctx.from?.id}</code>\n<a href = 'tg://user?id=${ctx.from?.id}'>${ctx.from?.first_name || ctx.from?.last_name}</a>`, { parse_mode: "HTML" });
            ctx.scene.enter("register", { startPayload: ctx.startPayload });
            console.log(ctx.from?.id, 'saved');
        };
    } catch (error) {
        console.log(error);
        updateUser(ctx.from?.id, { ...ctx.from, uid: ctx.from?.id });
        ctx.reply("🔝 Asosiy menyu", main);
    };
};