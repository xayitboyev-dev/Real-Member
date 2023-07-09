const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["👤 Userlar", "🏠 Client"],
    ["📦 Buyurtmalar"]
]).resize();

exports.balance = Markup.keyboard([
    ["➕ Qo'shish", "➖ Ayirish"]
]).resize();

exports.usersList = (users) => {
    const list = users.map((user) => [user.uid.toString()]);
    list.unshift(["🔝 Asosiy menyu"]);
    return Markup.keyboard(list).resize();
};

exports.userKeyboard = Markup.keyboard([
    ["📦 Buyurtmalar", "💎 Balans"],
    ["📤 Xabar yuborish", "👥 Referrals"],
    ["👤 Profile", "❌ O'chirish"],
    ["◀️ Orqaga"]
]);