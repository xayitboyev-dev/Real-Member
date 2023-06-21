const User = require('../../models/User');

module.exports = async (ctx, next) => {
    try {
        const admin = await User.findOne({ uid: ctx.from.id });
        if (admin.role === "admin") { next(); }
        else await ctx.scene.enter("main");
    } catch (error) {
        console.log(error);
    };
};