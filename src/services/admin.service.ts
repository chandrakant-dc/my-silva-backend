import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import Admin, { type IAdmin } from "../models/admin.model";
import { generateOtp } from "../utils/generateOtp";
import { generateAccessToken } from '../utils/jwtUtils';
import { sendOtpEmail } from "./email.service";

export const registerAdminModel = async (data: IAdmin) => {
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

        const userPayload = { id: admin.id };
        const accessToken = generateAccessToken(userPayload);
        res.status(200).json({
            message: "admin login successfully!",
            accessToken: accessToken
        });
    } catch (error) {
        throw error;
    }
}