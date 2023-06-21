const { connect } = require("mongoose");
const { MONGO_DB } = require("../config/config.json");

module.exports = () => connect(MONGO_DB);