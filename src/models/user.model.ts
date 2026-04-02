import { model, Schema } from "mongoose";

export interface IUser {
    fullName: string;
    mobile: string;
    email: string;
    password: string;
    createdAt?: Date;
    otp?: string | undefined,
    otpExpires?: Date | undefined,
}


const userSchema = new Schema<IUser>({
    fullName: {
        type: String,
        required: true,
    },
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

const User = model('User', userSchema);

export default User;