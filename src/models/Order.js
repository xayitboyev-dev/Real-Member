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
    joined: [{
        type: Number,
    }],
    channel: {
        type: String,
        required: true
    },
    customerId: {
        type: Number,
        required: true
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    }
});

module.exports = model("orders", orderSchema);