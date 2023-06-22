const { Markup } = require("telegraf");

exports.main = Markup.keyboard([
    ["🚀 Olmos yig'ish", "🛍 Buyurtma berish"],
    ["📦 Buyurtmalarim", "👥 Referral"],
    ["💎 Balans", "❓ Yordam"],
]).resize();

exports.cancel = Markup.keyboard([
    ["🔝 Asosiy menyu"]
]).resize();

exports.remove = Markup.removeKeyboard();