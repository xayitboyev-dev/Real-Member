const User = require("../models/User");
const bot = require("../core/bot");
const { REFERRAL_INC } = require("../config/config.json");

module.exports = async (offererId, myId, username) => {
    const offerer = await User.findOne({ uid: offererId });

    if (offererId != myId && offerer && !offerer.referrals.includes(myId)) {
        offerer.referrals.push(myId);
        offerer.$inc("balance", REFERRAL_INC);
        await offerer.save();
        await bot.telegram.sendMessage(offererId, `👤 <a href = '${username ? "https://t.me/" + username : `tg://user?id=${myId.toString()}`} '>Do'stingizni</a > botga taklif qilganingiz uchun sizga ${REFERRAL_INC} 💎 berildi!`, { parse_mode: "HTML" });
        await User.findOneAndUpdate({ uid: myId }, { offerer: offerer._id });
        console.log("new referral " + myId);
    };
};