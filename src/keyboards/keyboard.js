const { Markup } = require("telegraf");
const getStringPrice = require("../utils/getStringPrice");

exports.main = Markup.keyboard([
    ["🚀 Olmos yig'ish", "🛍 Buyurtma berish"],
    ["📦 Buyurtmalarim", "👥 Referral"],
    ["💎 Balans", "❓ Yordam"],
    ["💰 Olmos sotib olish"]
]).resize();

exports.cancel = Markup.keyboard([
    ["🔝 Asosiy menyu"]
]).resize();

exports.buyCoin = function (pricing) {
    const array = [];
    const col = 2;

    for (item of Array(Math.ceil(pricing.length / col))) {
        array.push(pricing.splice(0, col));
    };

    array.unshift(["🔝 Asosiy menyu"]);

    return Markup.keyboard(array).resize();
};

exports.remove = Markup.removeKeyboard();