const { Scenes: { Stage } } = require('telegraf');

const stage = new Stage([
    require("../admin/scenes/main"),
    require("../admin/scenes/sendMessage"),
    require("../admin/scenes/user"),
    require("../admin/scenes/users"),
    require("../admin/scenes/balance"),
    require("./toOrder"),
    require("./buyCoin"),
    require("./register")
]);

module.exports = stage;