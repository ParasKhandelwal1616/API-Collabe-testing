const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Auth middleware
const Workspace = require('../models/Workspace');

// @route   GET /api/workspaces/:id
// @desc    Get a single workspace by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            return res.status(404).json({ msg: 'Workspace not found' });
        }
        // TODO: Check if user is a member/owner of the workspace
        res.json(workspace);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Workspace not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/workspaces - List all workspaces (for owner/member)
// @desc    Get all workspaces for the authenticated user
// @access  Private
// router.get('/', auth, async (req, res) => {
//     try {
//         const workspaces = await Workspace.find({ owner: req.user.id }); // Only fetch workspaces owned by user
//         res.json(workspaces);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });

module.exports = router;