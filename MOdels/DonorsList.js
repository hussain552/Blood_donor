import mongoose from 'mongoose';

const bloodDonorSchema = new mongoose.Schema({
    fullName: { type: String, required: true, trim: true },
    mobileNumber: { type: String, required: true, unique: true, maxlength: 11 },
    emailId: { type: String, required: true, unique: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    age: { type: Number, required: true, min: 18, max: 65 }, // Typically 18-65 for blood donation
    bloodGroup: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String },
    postingDate: { type: Date, default: Date.now },
    status: { type: Number, default: 1 }, // 1 for active, 0 for inactive
    password: { type: String, required: true }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

// Check if the model is already defined to avoid the OverwriteModelError
const BloodDonor = mongoose.models.BloodDonor || mongoose.model('BloodDonor', bloodDonorSchema);

export default BloodDonor;
