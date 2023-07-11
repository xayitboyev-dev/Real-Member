module.exports = (ctx, next) => {
    if (ctx.from?.id && !["supergroup", "channel", "group"].includes(ctx.chat?.type)) next();
};