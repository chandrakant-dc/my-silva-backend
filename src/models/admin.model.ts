import { model, Schema } from "mongoose";

export interface IAdmin {
    email: string;
    password: string;
    createdAt?: Date;
    otp?: string | undefined,
    otpExpires?: Date | undefined,
    twoFactorEnabled: boolean,
    twoFactorSecret: string
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
    twoFactorEnabled: {
        type: Boolean,
        default: true,
    },
    twoFactorSecret: {
        type: String,
    },
    createdAt: { type: Date, default: Date.now }
})

const Admin = model('Admin', userSchema);

export default Admin;