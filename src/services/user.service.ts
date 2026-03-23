import User, { type IUser } from "../models/users.model";

export const getAllUsers = async () => {
    return [{ name: "jack", age: 90 }];
};

export const registerUserModel = async (data: IUser) => {
    try {
        const user = new User(data);
        return user.save();
    } catch (error) {
        throw error;
    }
}