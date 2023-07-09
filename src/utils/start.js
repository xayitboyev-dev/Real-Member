const User = require("../models/User");
const updateUser = require("./updateUser");
const referral = require("../utils/referral");
const { forwardMessage } = require("./toAdmins");

module.exports = async (ctx) => {
    try {
        await ctx.scene.enter("main", { fromStart: true });
        await User.create({ ...ctx.from, uid: ctx.from.id });
        if (ctx.startPayload) referral(parseInt(ctx.startPayload), ctx.from.id, ctx.from.username);
        forwardMessage(ctx);
        console.log(ctx.from.id, 'saved');
    } catch (error) {
        if (error.code == 11000) updateUser(ctx.from.id, { ...ctx.from, uid: ctx.from.id });
        else console.log(error);
    };
};