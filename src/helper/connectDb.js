const mongoose = require("mongoose");
const { MONGO_DB } = require("../config/config.json");

module.exports = () => {
    return mongoose.connect(MONGO_DB, { useBigInt64: false });
};