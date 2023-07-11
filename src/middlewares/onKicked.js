const User = require('../models/User');

module.exports = async (ctx, next) => {
    // on member is kicked
    if (ctx.myChatMember?.new_chat_member?.status == "kicked") {
        await User.findOneAndUpdate({ uid: ctx.from?.id }, { isActive: false });
    } else next();
};