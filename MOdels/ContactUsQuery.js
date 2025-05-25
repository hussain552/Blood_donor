import mongoose from 'mongoose';

// Create the schema for ContactUsQuery
const contactUsQuerySchema = new mongoose.Schema({
    name: { type: String, maxlength: 100 },
    EmailId: { type: String, maxlength: 120 },
    ContactNumber: { type: String, maxlength: 11 },
    Message: { type: String, default: null },
    PostingDate: { type: Date, default: Date.now },  // Automatically sets to current timestamp
    status: { type: Number, default: null }
}, { timestamps: true });  // Optional: Adds createdAt and updatedAt fields

// Create the model from the schema
const ContactUsQuery = mongoose.model('ContactUsQuery', contactUsQuerySchema);

export default ContactUsQuery;
