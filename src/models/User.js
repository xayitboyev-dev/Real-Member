const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    username: {
        type: String,
    },
    uid: {
        type: Number,
        unique: true
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        default: 'user'
    },
    referrals: [{
        type: Number,
    }]
});

module.exports = model('users', userSchema);