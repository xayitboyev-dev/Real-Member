const User = require("../models/User");

module.exports = (ctx) => User.findOne({ uid: ctx.from.id });