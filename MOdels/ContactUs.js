import mongoose from 'mongoose';

const contactUsSchema = new mongoose.Schema({
  Address: { type: String, default: null },
  EmailId: { type: String, default: null },
  ContactNo: { type: String, default: null }
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

const ContactUsInfo = mongoose.model('ContactUsInfo', contactUsSchema);

export default ContactUsInfo;
