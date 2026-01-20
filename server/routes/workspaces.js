const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // NEW
const Workspace = require('../models/Workspace');
const Request = require('../models/request');

// Middleware to check workspace access (owner or member)
const checkWorkspaceAccess = async (req, res, next) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ msg: 'Workspace not found' });
        }
        // Check if user is owner or a member
        if (workspace.owner.toString() !== req.user.id && !workspace.members.some(member => member.toString() === req.user.id)) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        req.workspace = workspace; // Attach workspace to request for further use
        next();
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Workspace not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @route   GET /api/workspaces/:id
// @desc    Get a single workspace by ID
// @access  Private
router.get('/:id', auth, checkWorkspaceAccess, async (req, res) => {
    try {
        res.json(req.workspace); // req.workspace is set by checkWorkspaceAccess
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/workspaces - Create a new workspace
// @access  Private
router.post('/', auth, async (req, res) => {
    const { name } = req.body;
    try {
        const workspace = new Workspace({ name, owner: req.user.id }); // Assign owner
        await workspace.save();
        
        // Create a default request for this workspace
        const defaultRequest = new Request({
            title: 'My First Request',
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            workspace: workspace._id,
            lastModifiedBy: req.user.id // Assign last modified by
        });
        await defaultRequest.save();

        res.status(201).json({ workspace, defaultRequestId: defaultRequest._id });
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
});

// @route   GET /api/workspaces/:id/requests - List requests for a workspace
// @access  Private
router.get('/:id/requests', auth, checkWorkspaceAccess, async (req, res) => {
    try {
        const requests = await Request.find({ workspace: req.params.id });
        res.json(requests);
    } catch (error) {
        console.error(err.message); // Should be error, not err
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/workspaces/:id/requests - Create a new request in a workspace
// @access  Private
router.post('/:id/requests', auth, checkWorkspaceAccess, async (req, res) => {
    try {
        const newRequest = new Request({
            workspace: req.params.id,
            title: 'Untitled Request',
            method: 'GET',
            url: '',
            lastModifiedBy: req.user.id // Assign last modified by
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        console.error(error.message);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;