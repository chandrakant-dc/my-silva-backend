import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Vikas Circle" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `<h3>Your OTP is: ${otp}</h3>`,
    });
};