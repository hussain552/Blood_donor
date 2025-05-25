import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
    }
};

export default connectDB;
