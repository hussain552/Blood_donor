import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const sendSMS = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      new URLSearchParams({
        message: message,
        language: "english",
        route: "q",               // Quick SMS route
        numbers: phoneNumber,     // Can be comma-separated
      }),
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
      
    );

    console.log("✅ SMS sent successfully:", response.data);
  } catch (error) {
    console.error("❌ Error sending SMS:", error.response?.data || error.message);
  }
};
