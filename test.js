const User = require('./src/models/User');
const connect = require('./src/helper/connectDb');
const bot = require("./src/core/bot");

async function find() {
    await connect();

    console.log("started");
    // const user = await User.findOneAndUpdate({ uid: 2056536342 }, { offerer: '6494b21ad0a525557968ef2a' });
    const user = await User.findOne({ uid: 2056536342 }).populate("offerer");
    console.log(user);
};

find();