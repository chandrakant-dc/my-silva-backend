import bcrypt from 'bcrypt';
import type { Request, Response } from "express";
import User from '../models/user.model.js';
import { getAllUsers, registerUserModel } from "../services/user.service.js";
import { generateOtp } from '../utils/generateOtp.js';
import { generateAccessToken } from '../utils/jwtUtils.js';
import { sendOTPEmail } from '../utils/sendMail.js';

export const getUsers = async (req: Request, res: Response) => {
    const users = await getAllUsers();
    res.json(users);
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password, fullName, mobile } = req.body;
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

        const userInfo = {
            fullName,
            mobile,
            email,
            password: hashedPassword
        }
        const isUserExist = await registerUserModel(userInfo);

        if (isUserExist === true) {
            res.status(400).json({
                message: "user already exist"
            })
            return;
        }

        await registerUserModel(req.body);

        const userPayload = { email: email };
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
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

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


export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const loggedInUser = await User.findOne({ email });
        if (loggedInUser === null) {
            res.status(404).json({
                message: "user not found!"
            })
            return;
        }
        const passwordMatch = await bcrypt.compare(password, loggedInUser.password);
        if (!passwordMatch) {
            res.status(400).json({
                message: "invalid password",
            });
            return;
        }

        const userPayload = { id: loggedInUser.id };
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
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "user logged in successfully"
        })

    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const otp = generateOtp();

        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

        await User.updateOne(
            { email },
            {
                otp: hashedOtp,
                otpExpires,
            }
        );

        await sendOTPEmail(email, otp);
        res.status(200).json({
            message: "otp sent to mail"
        })
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}

export const verifyUserOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "user not found" });

        const isValidOtp = await bcrypt.compare(otp, user.otp!);

        if (!isValidOtp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (user.otpExpires! < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        await User.updateOne(
            { _id: user._id },
            { $unset: { otp: "", otpExpires: "" } }
        );

        const userPayload = { id: user.id };
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
            sameSite: "strict",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "otp verified successfully!"
        });
    } catch (error) {
        res.status(400).json({
            message: "something went wrong",
            error: error
        })
    }
}