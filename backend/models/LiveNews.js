const mongoose = require('mongoose');

const LiveNewsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate articles
    },
    content: {
        type: String,
    },
    pubDate: {
        type: Date,
        required: true,
    },
    source: {
        type: String,
    },
    location: {
        country: String,
        lat: Number,
        lng: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours TTL index to automatically delete documents and save space
    }
});

module.exports = mongoose.model('LiveNews', LiveNewsSchema);
