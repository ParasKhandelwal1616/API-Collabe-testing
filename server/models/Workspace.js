const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Who is allowed to see this?
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // The list of requests in this workspace
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Workspace', workspaceSchema);