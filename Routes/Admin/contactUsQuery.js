import express from 'express';
import { body, validationResult } from 'express-validator';
import ContactUsQuery from '../../MOdels/ContactUsQuery.js';
import validator from 'validator';

const router = express.Router();


// Middleware to validate contact form inputs
const validateContactInput = (req, res, next) => {
    const { name, EmailId, ContactNumber, Message } = req.body;
    
    // Check for required fields
    const requiredFields = { name, EmailId, ContactNumber, Message };
    for (const [field, value] of Object.entries(requiredFields)) {
        if (!value || value.trim() === '') {
            return res.status(400).json({ 
                message: 'Validation failed',
                error: `${field} is required`
            });
        }
    }

    // Email validation
    if (!validator.isEmail(EmailId)) {
        return res.status(400).json({
            message: 'Validation failed',
            error: 'Invalid email address format'
        });
    }

    // Phone number validation (basic indian  format)
    if (!validator.isMobilePhone(ContactNumber, 'en-IN') || ContactNumber.length !== 10) {
        return res.status(400).json({
            message: 'Validation failed',
            error: 'Invalid phone number format. Please enter a 10-digit Indian number.'
        });
    }
    

    next();
};

// POST route for creating new contact us queries
router.post('/contactquery', validateContactInput,  async(req, res) => {
    try {
        const { name, EmailId, ContactNumber, Message} = req.body;

        const newQuery = new ContactUsQuery({
            name,
            EmailId,
            ContactNumber,
            Message,
          
        });

        const savedQuery = await newQuery.save();
        
        res.status(201).json({
            message: 'Contact form submitted successfully',
            data: savedQuery
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error submitting contact form',
            error: error.message
        });
    }
});

// Get  contact query 
router.get('/contactquery', async (req, res) => {
    try {
        const contacts = await ContactUsQuery.find().sort({ PostingDate: -1 }); // Newest first
        res.status(200).json({
            message: 'Contacts retrieved successfully',
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving contacts',
            error: error.message
        });
    }
});


// Delete contact query by ID
router.delete('/contactQuery/:id', async (req, res) => {
    try {
      const deletedQuery = await ContactUsQuery.findByIdAndDelete(req.params.id);
      
      if (!deletedQuery) {
        return res.status(404).json({
          success: false,
          message: 'Contact query not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Contact query deleted successfully',
        data: deletedQuery
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting contact query',
        error: error.message
      });
    }
  });
export default router;