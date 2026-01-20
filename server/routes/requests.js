const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Request = require('../models/request');
const Workspace = require('../models/Workspace'); // Needed to check workspace access

// Get a single request details
router.get('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    // Check workspace access
    const workspace = await Workspace.findById(request.workspace);
    if (!workspace) return res.status(404).json({ msg: 'Associated workspace not found' });

    if (workspace.owner.toString() !== req.user.id && !workspace.members.some(member => member.toString() === req.user.id)) {
        return res.status(403).json({ msg: 'Access denied to this request' });
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Request not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;