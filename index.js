import express from 'express';
import dotenv from 'dotenv';
import connectDB from './MOdels/config/connectDB.js';
import authRoutes from './Routes/Auth.js';
import contactUsQueryRouter from './Routes/Admin/contactUsQuery.js';
import GetDonor from './Routes/GetDonorList.js'
import cors from "cors";
import postBloodRequest from "./Routes/PostBloodRequest.js"
import Getrequirer from "./Routes/GetRequirer.js"
import profile from "./Routes/getProfile.js"
import password from "./Routes/password.js"
import adminRoutes from "./Routes/Admin/AdminAuth.js"
import DeleteUpdateDonor from   "./Routes/Admin/DeleteAndUpdateDonot.js"
dotenv.config();
const app = express();

app.use(cors({
  origin: true, // Reflects the request origin dynamically
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));



const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);

app.use('/api',postBloodRequest);
app.use('/api',GetDonor)
app.use('/api',Getrequirer)
app.use('/api',profile)
app.use('/api',password)
app.use('/api',DeleteUpdateDonor)
// Admin
app.use("/api/admin", adminRoutes);
app.use('/api/admin', contactUsQueryRouter);
connectDB();



app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
