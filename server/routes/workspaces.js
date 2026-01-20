const express = require('express');
const router = express.Router();
const Workspace = require('../models/Workspace');
const Request = require('../models/request'); // Ensure correct case for filename

// GET /api/workspaces - List all workspaces
router.get('/', async (req, res) => {
    try {
        const workspaces = await Workspace.find();
        res.json(workspaces);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/workspaces - Create a new workspace
router.post('/', async (req, res) => {
    const { name } = req.body;
    try {
        const workspace = new Workspace({ name });
        await workspace.save();
        
        // Create a default request for this workspace
        const defaultRequest = new Request({
            title: 'My First Request',
            method: 'GET',
            url: 'https://jsonplaceholder.typicode.com/todos/1',
            workspace: workspace._id
        });
        await defaultRequest.save();

        res.status(201).json({ workspace, defaultRequestId: defaultRequest._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/workspaces/:id/requests - List requests for a workspace
router.get('/:id/requests', async (req, res) => {
    try {
        const requests = await Request.find({ workspace: req.params.id });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/workspaces/:id/requests - Create a new request in a workspace
router.post('/:id/requests', async (req, res) => {
    try {
        const newRequest = new Request({
            workspace: req.params.id,
            title: 'Untitled Request',
            method: 'GET',
            url: ''
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;