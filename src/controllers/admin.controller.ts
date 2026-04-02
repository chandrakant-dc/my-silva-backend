import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import { loginAdminModel, registerAdminModel, verifyAdmin2FAService, verifyAdminOtpModel } from "../services/admin.service.js";
import { generate2FA } from '../services/twofa.service.js';

export const registerAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({
                message: "email is required"
            })
            return;
        }
        if (!password) {
            res.status(400).json({
                message: "password is required"
            })
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const { encryptedSecret, qrCode } = await generate2FA(email);

        const adminInfo = {
            email,
            password: hashedPassword,
            twoFactorSecret: encryptedSecret,
            twoFactorEnabled: true,
        }
        const isAdminExist = await registerAdminModel(adminInfo);

        if (isAdminExist === true) {
            res.status(400).json({
                message: "admin already exist"
            })
            return;
        }

        res.status(201).json({
            message: "admin registered successfully!",
            qrCode
        })
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        await loginAdminModel(req, res);
        return res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        await verifyAdminOtpModel(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
};

export const verifyAdmin2FA = async (req: Request, res: Response) => {
    try {
        await verifyAdmin2FAService(req, res);
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
};

export const logoutAdmin = (req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "strict",
    });
    res.json({ status: true, message: "admin logged out" });
};

export const checkToken = (req: Request, res: Response) => {
    res.status(200).json({ status: true });
}