import mongoose from 'mongoose';

// Create the schema for BloodRequirer
const bloodRequirerSchema = new mongoose.Schema({
    BloodDonorID: { // Corrected 'BloodDonarID' to 'BloodDonorID'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BloodDonor',
        required: true
    },
    name: { 
        type: String, 
        maxlength: 250, 
        required: true 
    },
    EmailId: { 
        type: String, 
        maxlength: 250, 
        required: true 
    },
    ContactNumber: { 
        type: String, // Changed from 'Number' to 'String' for phone numbers
        required: true 
    },
    BloodRequirefor: { 
        type: String, 
        maxlength: 250, 
        required: true 
    },
    Message: { 
        type: String, 
        default: null 
    },
    RequesterEmail: { 
        type: String, 
        maxlength: 250, 
        required: true 
    },
    BloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    ApplyDate: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true }); 

// Create the model from the schema
const BloodRequirer = mongoose.models.BloodRequirer || mongoose.model("BloodRequirer", bloodRequirerSchema);

export default BloodRequirer;
