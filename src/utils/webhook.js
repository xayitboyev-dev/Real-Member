const express = require("express");
const { BOT_TOKEN } = require("../config/config.json");
const axios = require("axios");
const app = express();
const bot = require("../core/bot");

app.use(express.json());
app.get("/", (req, res) => {
    console.log("One request");
    res.send(`<h1>Hello World</h1><br><form method="GET" action="https://api.telegram.org/bot${BOT_TOKEN}/setWebhook"><input type="text" name="url" placeholder="Webhook url"><button type="submit">Set Webhook</button></form>`);
});

app.post("/update", (req, res) => {
    console.log("updated");
    bot.handleUpdate(req.body);
    res.json({ ok: true });
});

const listener = app.listen(process.env.PORT, () => console.log(listener.address().port));

setInterval(() => {
    axios.get("https://real-member.onrender.com")
        .then((response) => "write your function here")
        .catch((error) => console.log(error));
}, 100000);