const connect = require('./src/helper/connectDb');
const fs = require("fs");
const mongoose = require("mongoose");
const User = require('./src/models/User');
const Order = require('./src/models/Order');
const bot = require('./src/core/bot');
const toAdmins = require('./src/utils/toAdmins');

const arr = [
    6222734470,
    6058458325,
    6015115194,
    6361058009,
    6260110776,
    5844386094,
    6330813476,
    6250389693,
    5472792406,
    6217660501,
    5688055279,
    6205359692,
    5683136470,
    5978239176,
    6019411648,
    6078994190,
    6141892279,
    6171029240,
    5508043510,
    6170866889,
    5234981573,
    5696092292,
    5781091240,
    6135779343
]
let count = 0;

async function find() {
    await connect();
    console.log("Connected to database");
    // const result = await User.find();
    const result = [{ uid: 5386632274 }];
    // console.log("HAS PHONE", result.filter((item) => item.phone).length);
    // console.log("HAS NOT PHONE", result.filter((item) => { !item.phone; console.log(item.first_name) }).length);
    // console.log();
    for await (const item of result) {
        try {
            const user = await bot.telegram.getChat(item.uid);
            count++
            console.log(count);
        } catch (error) {

        }
    }

    result.forEach(async (item, index) => {
        // if (item.offerer) {
        // return
        // const offerer = await User.findOne({ _id: item.offerer });

        // await User.findOneAndUpdate({ uid: item.uid }, { offerer: offerer.uid });
        // console.log("updated " + item.uid);
        // }


        // const isExists = arr.includes(item.uid);
        // if (isExists) {
        // const deleted = await User.findOneAndDelete({ uid: item.uid });
        // console.log("Deleted:", item.uid);
        // };
        // await User.findOneAndUpdate({ uid: item.uid }, { _id: new mongoose.Types.ObjectId(item.id) });
        // console.log("saved:", index);
    });
};

find();


process.on("unhandledRejection", (err) => console.log(err));
process.on("uncaughtException", (err) => console.log(err));