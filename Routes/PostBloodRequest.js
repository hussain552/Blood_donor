import express from 'express';
import BloodRequirer from "../MOdels/BloodRequirer.js"; // Fix the import path to lowercase

const router = express.Router();

router.post('/blood-requirer', async (req, res) => {
    try {
        const { BloodDonorID, name, EmailId, ContactNumber, BloodGroup, BloodRequirefor, Message, RequesterEmail } = req.body;

        const newRequest = new BloodRequirer({
            BloodDonorID,
            name,
            EmailId,
            BloodGroup,  // Fixed: include BloodGroup
            ContactNumber,
            BloodRequirefor,
            Message,
            RequesterEmail // Save the Requester's email
        });

        await newRequest.save();
        res.status(201).json({ message: 'Request submitted successfully', request: newRequest });
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
