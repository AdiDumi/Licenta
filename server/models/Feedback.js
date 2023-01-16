const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    receiver: {
        dn: {
            type: String,
            required: true
        },
        cn: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        mail: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        }
    },
    reporter: {
        dn: {
            type: String,
            required: true
        },
        cn: {
            type: String,
            required: true
        },
        uid: {
            type: String,
            required: true
        },
        mail: {
            type: String,
            required: true
        },
        displayName: {
            type: String,
            required: true
        }
    },
    manager: {
        type: String,
        default: null
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    anonymous: {
        type: Boolean,
        required: true
    },
    visibleForManager: {
        type: Boolean,
        required: true
    },
    receivedDate: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    },
    appreciated: {
        type: Boolean,
        default: false
    }
});

module.exports = Feedback = mongoose.model("feedback", FeedbackSchema);