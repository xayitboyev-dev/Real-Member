const { model, Schema } = require("mongoose");

const orderSchema = new Schema({
    orderNumber: {
        type: Number,
        required: true,
        unique: true
    },
    count: {
        type: Number,
        required: true
    },
    joined: {
        type: [{
            type: Number,
            unique: true
        }],
    },
    channel: {
        type: String,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
});

module.exports = model("orders", orderSchema);