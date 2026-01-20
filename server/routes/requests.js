const express = require('express');
const router = express.Router();
const Request = require('../models/request');

// Get a single request details
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
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