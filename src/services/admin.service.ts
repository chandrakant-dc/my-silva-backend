import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import Admin from "../models/admin.model.js";
import { generateOtp } from "../utils/generateOtp.js";
import { generateAccessToken } from '../utils/jwtUtils.js';
import { sendOtpEmail } from "./email.service.js";
import { verify2FA } from './twofa.service.js';

export const registerAdminModel = async (data: { email: string, password: string, twoFactorSecret: string, twoFactorEnabled: boolean }) => {
    try {
        const alreadyExistAdmin = await Admin.findOne({ email: data?.email });
        if (alreadyExistAdmin) {
            return true;
        }
        const newAdmin = new Admin(data);
        return newAdmin.save();
    } catch (error) {
        throw error;
    }
}

export const loginAdminModel = async (req: Request, res: Response) => {
    try {
        // const admin = await Admin.findOne({ email: data?.email });
        const { email, password } = req.body;
        const loggedInAdmin = await Admin.findOne({ email });
        if (loggedInAdmin === null) {
            res.status(404).json({
                message: "admin not found!"
            })
            return;
        }
        const passwordMatch = await bcrypt.compare(password, loggedInAdmin.password);
        if (!passwordMatch) {
            res.status(400).json({
                message: "invalid password",
            });
            return;
        }

        const otp = generateOtp();

        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        await Admin.updateOne(
            { email },
            {
                otp: hashedOtp,
                otpExpires,
            }
        );

        await sendOtpEmail(email, otp);

        return true;
    } catch (error) {
        throw error;
    }
}

export const verifyAdminOtpModel = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "admin not found" });

        const isValidOtp = await bcrypt.compare(otp, admin.otp!);

        if (!isValidOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (admin.otpExpires! < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        await Admin.updateOne(
            { _id: admin._id },
            { $unset: { otp: "", otpExpires: "" } }
        );

        res.status(200).json({
            message: "email otp verified successfully!",
            adminId: admin.id
        });
    } catch (error) {
        throw error;
    }
}

export const verifyAdmin2FAService = async (req: Request, res: Response) => {
    try {
        const { adminId, token } = req.body;

        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ message: "admin not found!" });
        }

        const isValid = verify2FA(admin.twoFactorSecret, token);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid 2FA code" });
        }

        const userPayload = { id: admin.id };
        const accessToken = generateAccessToken(userPayload);

        // res.cookie("token", accessToken, {
        //     httpOnly: true,
        //     secure: false, // true in production (HTTPS)
        //     sameSite: "lax",
        //     maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
        // });

        // for production
        res.cookie("token", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            message: "admin login successfully!"
        });
    } catch (error) {
        throw error;
    }
}