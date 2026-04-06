import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_PASS,
        },
    });

    await transporter.sendMail({
        from: `"Vikas Circle" <${process.env.BREVO_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `<h3>Your OTP is: ${otp}</h3>`,
    });
};