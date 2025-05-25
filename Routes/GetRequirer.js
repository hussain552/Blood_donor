import express from 'express';
import BloodRequirer from '../MOdels/BloodRequirer.js';

const router = express.Router();

// GET route to fetch blood requests for a specific user
router.get('/bloodRequirer', async (req, res) => {
    const { EmailId } = req.query; // Get email from query parameters

    if (!EmailId) {
        return res.status(400).json({ message: 'Email ID is required' });
    }

    try {
        const requests = await BloodRequirer.find({ EmailId });
        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching requests' });
    }
});


export default router;
