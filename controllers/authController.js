import bcrypt from 'bcryptjs';
import BloodDonor from '../MOdels/DonorsList.js';

// User Signup
export const registerUser = async (req, res) => {
    try {
        const { fullName, emailId, mobileNumber, gender, age, bloodGroup, address, password } = req.body;

        // Check if user already exists
        const existingUser = await BloodDonor.findOne({ $or: [{ emailId }, { mobileNumber }] });
        if (existingUser) return res.status(400).json({ message: 'Email or Mobile Number already registered' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new BloodDonor({
            fullName, emailId, mobileNumber, gender, age, bloodGroup, address, password: hashedPassword
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// User Login
export const loginUser = async (req, res) => {
    try {
        const { emailId, password } = req.body;

        // Check if user exists
        const user = await BloodDonor.findOne({ emailId });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // Successful login response (no JWT)
        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
