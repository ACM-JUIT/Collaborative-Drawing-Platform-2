const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
    drawingId: { type: String, required: true, unique: true },
    state: { type: String, required: true },
});

module.exports = mongoose.model('Drawing', drawingSchema);
