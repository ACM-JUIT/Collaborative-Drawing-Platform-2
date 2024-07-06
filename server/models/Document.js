const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('Document', DocumentSchema);