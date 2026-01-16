const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Request'
    },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        default: 'GET'
    },
    url: {
        type: String,
        default: ''
    },
    headers: [{
        key: String,
        value: String,
        isChecked: { type: Boolean, default: true }
    }],
    queryParams: [{
        key: String,
        value: String,
        isChecked: { type: Boolean, default: true }
    }],
    bodyContentType: {
        type: String,
        enum: ['application/json', 'text/plain'], // Add 'multipart/form-data' later if needed
        default: 'application/json'
    },
    bodyContent: {
        type: String, // Storing as string to allow invalid JSON while drafting
        default: ''
    },
    lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Request', requestSchema);