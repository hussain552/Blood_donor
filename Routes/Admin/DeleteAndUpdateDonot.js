import express from "express";
import mongoose from "mongoose";
import BloodDonor from "../../MOdels/DonorsList.js";

const router = express.Router();

router.put("/editingId/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donor ID format" });
    }

    const existingDonor = await BloodDonor.findById(id);
    if (!existingDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    const { postingDate, status, ...updateData } = req.body;
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updatedDonor = await BloodDonor.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Donor updated successfully", donor: updatedDonor });

  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ errors: messages });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      });
    }
    res.status(500).json({ message: "Server error updating donor" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid donor ID format" });
    }

    const deletedDonor = await BloodDonor.findByIdAndDelete(id);
    if (!deletedDonor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    res.status(200).json({ message: "Donor deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error deleting donor" });
  }
});

export default router;