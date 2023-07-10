const User = require("../models/User");
const bot = require("../core/bot");
const { REFERRAL_INC } = require("../config/config.json");

module.exports = async (offererId, myId, username) => {
    const offerer = await User.findOne({ uid: offererId });

    if (offerer && offererId != myId && !offerer.referrals.includes(myId)) {
        await User.findOneAndUpdate({ uid: offererId }, { $inc: { "balance": REFERRAL_INC }, $push: { "referrals": myId } });
        await bot.telegram.sendMessage(offererId, `👤 <a href = '${username ? "https://t.me/" + username : `tg://user?id=${myId.toString()}`} '>Do'stingizni</a > botga taklif qilganingiz uchun sizga ${REFERRAL_INC} 💎 berildi!`, { parse_mode: "HTML" });
        await User.findOneAndUpdate({ uid: myId }, { offerer: offerer.uid });
        console.log("new referral " + myId);
    };
};