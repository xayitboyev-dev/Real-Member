const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("../admin/scenes/main"),
    require("../admin/scenes/sendMessage"),
    require("../admin/scenes/sendTo"),
    require("./main"),
]);

module.exports = stage;