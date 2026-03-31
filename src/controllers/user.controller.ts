import type { Request, Response } from "express";
import { getAllUsers, registerUserModel } from "../services/user.service.js";

export const getUsers = async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.json(users);
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const user = await registerUserModel(req.body);
        res.status(201).json({
            message: "user registered successfully!"
        })
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}