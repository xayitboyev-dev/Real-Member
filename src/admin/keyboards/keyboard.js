const { Markup } = require('telegraf');

exports.main = Markup.keyboard([
    ["📤 Xabar tarqatish", "📊 Statistika"],
    ["👤 Userga xabar"]
]).resize();