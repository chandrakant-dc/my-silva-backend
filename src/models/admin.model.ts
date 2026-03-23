import { model, Schema } from "mongoose";

export interface IAdmin {
    email: string;
    password: string;
    createdAt?: Date;
    otp?: string | undefined,
    otpExpires?: Date | undefined,
}


const userSchema = new Schema<IAdmin>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    otp: String,
    otpExpires: Date,
    createdAt: { type: Date, default: Date.now }
})

const Admin = model('Admin', userSchema);

export default Admin;