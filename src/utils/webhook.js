const express = require("express");
const { SECRET_TOKEN } = require("../config/config.json");
const axios = require("axios");
const app = express();
const bot = require("../core/bot");

let webhookUrl;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`<h1>Setup webhook</h1><br><form method="POST" action="/setWebhook"><input type="text" name="url" id="url" placeholder="Webhook url"><br><button type="submit">Submit</button></form><script type="text/javascript">document.getElementById("url").value = window.location.href;</script>`);
});

app.post("/update", (req, res) => {
    if (req.header("X-Telegram-Bot-Api-Secret-Token") === SECRET_TOKEN) bot.handleUpdate(req.body, res);
    res.json({ ok: true });
});

app.post("/setWebhook", async (req, res) => {
    try {
        const info = await bot.telegram.setWebhook(req.body.url, { secret_token: SECRET_TOKEN });
        webhookUrl = req.body?.url?.match(/^https?:\/\/[^#?\/]+/)[0];
        res.json(info);
    } catch (error) {
        res.json(error.message);
    };
});

const listener = app.listen(process.env.PORT, () => console.log("http://localhost:" + listener.address().port));

setInterval(() => {
    axios.get(webhookUrl)
        .then((response) => console.log("REQUEST TO WEBHOOK URL IN INTERVAL"))
        .catch((error) => console.log(error));
}, 100000);