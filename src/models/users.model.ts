import { model, Schema } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}


const userSchema = new Schema<IUser>({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: { type: Date, default: Date.now }
})

const User = model('User', userSchema);

export default User;