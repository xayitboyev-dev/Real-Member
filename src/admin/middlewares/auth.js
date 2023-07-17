const User = require('../../models/User');
const start = require('../../utils/start');

module.exports = async (ctx, next) => {
    try {
        const admin = await User.findOne({ uid: ctx.from?.id });
        if (admin.role === "admin") { next(); }
        else start(ctx);
    } catch (error) {
        console.log(error);
    };
};