const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    user: {
        type: String,
        required: true
    }, 
    refreshToken: {
        type: String,
        required: true
    }
});

module.exports = Token = mongoose.model("tokens", TokenSchema);