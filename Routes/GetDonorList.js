import express from 'express';
import BloodDonor from '../MOdels/DonorsList.js';

const router = express.Router();

// GET all donors
router.get('/donors', async (req, res) => {
    try {
        const donors = await BloodDonor.find(); // Fetch all donors
        res.status(200).json(donors);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});




router.get('/blood-group-counts', async (req, res) => {
    try {
        const bloodGroupCounts = await BloodDonor.aggregate([
            { $project: { bloodGroup: { $toUpper: "$bloodGroup" } } }, 
            { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
        ]);

        if (bloodGroupCounts.length === 0) {
            return res.status(404).json({ message: 'No blood group data available' });
        }

        res.status(200).json(bloodGroupCounts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch blood group counts', error: error.message });
    }
});

export default router;