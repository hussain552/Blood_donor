import express from "express";
import BloodDonor from "../MOdels/DonorsList.js"; // Ensure correct case
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Step 1: Request Password Reset
export const forgotPassword = async (req, res) => {
    try {
        const { emailId } = req.body;
        console.log("Received forgot password request for:", emailId);

        const user = await BloodDonor.findOne({ emailId });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Create Reset Link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        console.log("Reset Link:", resetLink);

        // Send Email via SendGrid
        const msg = {
            to: user.emailId,
            from: "ahamedhussainpasha@gmail.com", // Verified sender in SendGrid
            replyTo: "ahamedhussainpasha@gmail.com",
            subject: "Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
        };

        await sgMail.send(msg);

        console.log("Password reset email sent to:", user.emailId);
        res.json({ message: "Reset link sent to email" });
    } catch (err) {
        console.error("Error in forgotPassword:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Step 2: Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        console.log("Reset Password Attempt with Token:", token);

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        const user = await BloodDonor.findById(decoded.id);
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // Hash New Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        console.log("Password updated successfully for user:", user.emailId);
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error in resetPassword:", err.message);
        res.status(400).json({ message: "Invalid or expired token" });
    }
};
