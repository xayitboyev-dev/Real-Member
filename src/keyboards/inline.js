const { Markup } = require("telegraf");

exports.task = (channel, id, type) => [
    [Markup.button.callback("🔄 Yangilash", "update")],
    [Markup.button.callback("✅ A'zo bo'ldim", `joined_${id}`)],
    [Markup.button.url(`↗️ ${type == "channel" ? "Kanalga" : "Guruhga"} o'tish`, "t.me/" + channel)],
];

exports.finishOrder = Markup.inlineKeyboard([
    [Markup.button.callback("✅ Tayyor", "ready"), Markup.button.callback("❌ Bekor qilish", "cancel")]
]);

exports.cancelOrder = (id) => Markup.inlineKeyboard([
    [Markup.button.callback("❌ Buyurtmani bekor qilish", "cancel_order_" + id)]
]);

exports.shareReferral = Markup.inlineKeyboard([
    [Markup.button.switchToChat("Referralingizni uzatish ↗️", "referral")]
]);

exports.enterToBot = (username, referralId) => [
    [Markup.button.url("Botga kirish ↗️", `https://t.me/${username}?start=${referralId}`)]
]