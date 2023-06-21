const bot = require("./core/bot");
const connectDb = require("./helper/connectDb");
const stage = require("./scenes/index");
const start = require("./utils/start");

bot.use(stage.middleware());
require("./admin/index");
bot.command("random", require("./utils/getChannel"));
bot.command("test", async (ctx) => {

    
});
bot.use(start);

async function startBot() {
    try {
        await connectDb();
        console.log("Connected to database");
        bot.launch();
        console.log("Bot started");
    } catch (error) {
        console.log(error);
        process.exit(0);
    };
};

startBot();