const bot = require("./core/bot");
const connectDb = require("./helper/connectDb");
const updateUser = require("./utils/updateUser");
const stage = require("./scenes/index");
const onKicked = require("./middlewares/onKicked");
const checkUser = require("./middlewares/checkUser");

bot.use(stage.middleware());
bot.on("chat_join_request", async (ctx) => {
    const user = await findMe(ctx);
    ctx.approveChatJoinRequest(ctx.from?.id);
    if (!user) {
        ctx.chat.id = ctx.from.id;
        start(ctx);
    };
});
bot.use(checkUser);
bot.use(onKicked);
require("./admin/index");
require("./utils/setInlineMode");
require("./utils/backup");
require("./scenes/main");

async function startBot(webhook) {
    try {
        await connectDb();
        console.log("Connected to database");
        if (webhook == "-webhook") {
            console.log("Setup webhook");
            require("./utils/webhook");
        } else {
            bot.launch();
            console.log("Bot started");
        };
    } catch (error) {
        console.log(error);
        process.exit(0);
    };
};

startBot(process.argv[2]);

process.on('uncaughtException', function (error) {
    console.log('uncaughtException:', error);
});

process.on('unhandledRejection', function (error) {
    if (error?.response?.message == "Forbidden: bot was blocked by the user") {
        updateUser(error?.on?.payload?.chat_id, { isActive: false });
    } else {
        console.log('unhandledRejection:', error);
    };
});