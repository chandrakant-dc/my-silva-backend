import User, { type IUser } from "../models/user.model.js";

export const getAllUsers = async () => {
    return [{ name: "jack", age: 90 }];
};

export const registerUserModel = async (data: IUser) => {
    try {
        const alreadyExistUser = await User.findOne({ email: data?.email });
        if (alreadyExistUser) {
            return true;
        }
        const newUser = new User(data);
        const savedUser = await newUser.save();

        return savedUser._id;
    } catch (error) {
        throw error;
    }
}