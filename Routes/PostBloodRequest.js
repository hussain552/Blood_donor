import express from "express";
import BloodRequirer from "../MOdels/BloodRequirer.js";
import BloodDonor from "../MOdels/DonorsList.js";
import { sendSMS } from "./utils/sendSMS.js"; // ✅ fixed path and case

const router = express.Router();

router.post("/blood-requirer", async (req, res) => {
  try {
    const {
      BloodDonorID,
      name,
      EmailId,
      ContactNumber,
      BloodGroup,
      BloodRequirefor,
      Message,
      RequesterEmail,
    } = req.body;

    // Save request
    const newRequest = new BloodRequirer({
      BloodDonorID,
      name,
      EmailId,
      ContactNumber,
      BloodGroup,
      BloodRequirefor,
      Message,
      RequesterEmail,
    });

    await newRequest.save();

    // Find donor
    const donor = await BloodDonor.findById(BloodDonorID);
    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // SMS message text
    const smsMessage = `Hi ${donor.name}, ${name} (${BloodGroup}) urgently needs blood for ${BloodRequirefor}. 
Contact: ${ContactNumber}. Message: ${Message}`;
console.log(smsMessage)
 
    await sendSMS(donor.mobileNumber, smsMessage); // ✅ ensure correct field

    res
      .status(201)
      .json({
        message: "Request submitted & SMS sent successfully",
        request: newRequest,
      });
  } catch (error) {
    console.error("Error handling request:", error);
    res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

export default router;
