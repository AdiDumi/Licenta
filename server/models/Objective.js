const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectiveSchema = new Schema ({
    user: {
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
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: Number,
        required: true
    },
    mainObjective: {
        type: String
    },
    target: {
        type: Number
    },
    targetUnitMeasure: {
        type: String
    },
    introducedDate: {
        type: Date,
        default: Date.now
    },
    deadline: {
        type: Date
    },
    progress: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        default: 0
    }
});

module.exports = Objective = mongoose.model("objective", ObjectiveSchema);