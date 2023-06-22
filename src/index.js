const bot = require("./core/bot");
const connectDb = require("./helper/connectDb");
const stage = require("./scenes/index");
const start = require("./utils/start");

bot.use(stage.middleware());
require("./admin/index");
require("./utils/setInlineMode");
bot.use(start);

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