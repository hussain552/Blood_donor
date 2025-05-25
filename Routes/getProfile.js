import express from 'express';
import BloodDonor from '../MOdels/DonorsList.js'; // Ensure correct case

const router = express.Router();

// GET route to fetch profile details for a specific user
router.get('/profile', async (req, res) => {
    const { emailId } = req.query; // Get email from query parameters

    if (!emailId) {
        return res.status(400).json({ success: false, message: 'Email ID is required' });
    }

    try {
        const donorProfile = await BloodDonor.findOne({ emailId });
        console.log("this is data: ",donorProfile)

        if (!donorProfile) {
            return res.status(404).json({ success: false, message: 'No profile found for this email' });
        }

        res.status(200).json({ success: true, data: donorProfile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


router.put('/profile', async (req, res) => {
    try {
        const { emailId, ...updateData } = req.body;

        if (!emailId) {
            return res.status(400).json({ success: false, message: 'Email ID is required' });
        }

        const allowedFields = ["fullName", "bloodGroup", "mobileNumber", "address", "message", "age"];

        const filteredData = Object.fromEntries(
            Object.entries(updateData)
                .filter(([key, value]) => 
                    allowedFields.includes(key) &&
                    (key === "age" ? !isNaN(value) && Number(value) > 0 : typeof value === 'string' && value.trim())
                )
                .map(([key, value]) => [key, key === "age" ? Number(value) : value.trim()])
        );

        if (Object.keys(filteredData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields to update' });
        }

        const updatedDonor = await BloodDonor.findOneAndUpdate(
            { emailId },
            { $set: filteredData },
            { new: true, runValidators: true }
        );

        if (!updatedDonor) {
            return res.status(404).json({ success: false, message: 'No profile found for this email' });
        }

        res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedDonor });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

export default router;