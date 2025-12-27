const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, enum: ['book', 'podcast', 'story'], required: true },
    author: String,
    sourceUrl: { type: String, required: true }, // MP3 URL or Text
    imageUrl: String
});

module.exports = mongoose.model('Content', ContentSchema);