const { Markup } = require("telegraf");

exports.main = Markup.keyboard([
    ["🚀 Olmos yig'ish", "🛍 Buyurtma berish"],
    ["🛒 Buyurtmalarim", "❓ Yordam"],
    ["💎 Balans"],
]).resize();

exports.cancel = Markup.keyboard([
    ["🔙 Orqaga"]
]).resize();