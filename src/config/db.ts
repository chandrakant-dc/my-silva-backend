import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || "";

export async function dbConnection() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("db connected!");

    } catch (error) {
        console.log(error);
    }
}