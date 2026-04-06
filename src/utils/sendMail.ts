import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (to: string, otp: string) => {
    try {
        const response = await resend.emails.send({
            from: "OTP Service <onboarding@resend.dev>",
            to: to,
            subject: "OTP Verification",
            html: `<h2>Your OTP is: ${otp}</h2>`,
        });
        return true;
    } catch (error) {
        console.log("Email error:", error);
        return false;
    }
};