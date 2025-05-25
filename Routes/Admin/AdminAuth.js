import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../../MOdels/AdminReg.js"; // Ensure correct path
import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;


//  1️⃣ Admin Registration
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if admin exists
        let admin = await Admin.findOne({ email });
        if (admin) return res.status(400).json({ message: "Admin already exists" });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new admin
        admin = new Admin({ name, email, password: hashedPassword, role });
        await admin.save();

        res.json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// 2️⃣ Admin Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid email or password" });

        // Validate password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        // Generate token
        const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});



// ---------------------------------Admin Passwords recovery---------------------------------------------


// Forgot Password Route
// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        // Generate reset token with 1 hour expiration
        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: '1h' }
        );

        admin.resetToken = token;
        await admin.save();

        const resetLink = `${process.env.FRONTEND_URL}/admin-reset-password/${token}`;

        // Email configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset. Click the link below to proceed:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link will expire in 1 hour.</p>
            `,
        });

        res.json({ message: "Reset password link sent to your email" });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Validate password complexity
        if (!password || password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(process.env.JWT_SECRET)
        const admin = await Admin.findOne({ 
            _id: decoded.id, 
            resetToken: token 
        });

        if (!admin) {
            return res.status(400).json({ message: " poolekm Invalid or expired token" });
        }

        // Check if new password is different from old
        const isSamePassword = await bcrypt.compare(password, admin.password);
        if (isSamePassword) {
            return res.status(400).json({ message: "New password must be different from old password" });
        }

        // Update password
        admin.password = await bcrypt.hash(password, 10);
        admin.resetToken = undefined;
        await admin.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Reset Password Error:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Reset token has expired" });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;