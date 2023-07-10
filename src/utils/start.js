const User = require("../models/User");
const updateUser = require("./updateUser");
const referral = require("../utils/referral");
const { forwardMessage } = require("./toAdmins");

module.exports = async (ctx) => {
    try {
        const user = await User.findOne({ uid: ctx.from.id });
        if (user) {
            if (user.phone) throw "User already";
            else {
                ctx.scene.enter("register", { startPayload: ctx.startPayload });
            };
        } else {
            await User.create({ ...ctx.from, uid: ctx.from.id });
            forwardMessage(ctx);
            ctx.scene.enter("register", { startPayload: ctx.startPayload });
            console.log(ctx.from.id, 'saved');
        };
    } catch (error) {
        updateUser(ctx.from.id, { ...ctx.from, uid: ctx.from.id });
        ctx.scene.enter("main", { fromStart: true });
    };
};