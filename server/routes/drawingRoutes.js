const express = require('express');

const router = express.Router();

// Placeholder route example
router.get('/state/:drawingId', (req, res) => {
    const { drawingId } = req.params;
    res.json({ message: `Fetching state for drawing ID: ${drawingId}` });
});

module.exports = router;
