const { Markup } = require("telegraf");

exports.task = (channel, id, type) => [
    [Markup.button.callback("⬅️", "update"), Markup.button.callback("A'zo bo'ldim ✅", `joined_${id}`), Markup.button.callback("➡️", "update")],
    [Markup.button.url(`${type == "supergroup" ? "Guruhga" : "Kanalga"} o'tish`, "t.me/" + channel)],
];