const bot = require("./core/bot");
const connectDb = require("./helper/connectDb");
const stage = require("./scenes/index");
const start = require("./utils/start");

const express = require("express");
const app = express();
app.use(express.json());
const { BOT_TOKEN } = require("./config/config.json");
app.use((req, res) => res.send(`<h1>Hello World</h1><br><form method="GET" action="https://api.telegram.org/bot${BOT_TOKEN}/setWebhook"><input type="text" name="url" placeholder="Webhook url"><button type="submit">Set Webhook</button></form>`));
app.post("/updates", (req, res) => {
    bot.handleUpdate(req.body);
    res.json({ ok: true });
});
const listener = app.listen(process.env.PORT, () => console.log(listener.address().port));

bot.use(stage.middleware());
require("./admin/index");
bot.command("random", require("./utils/getChannel"));
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

// startBot();