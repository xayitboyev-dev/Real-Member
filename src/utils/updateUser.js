const User = require('../models/User');

module.exports = async function (uid, data) {
    try {
        await User.findOneAndUpdate({ uid }, { ...data, isActive: true });
        console.log(uid, 'updated');
    } catch (error) {
        console.log(uid, 'not updated');
    };
};