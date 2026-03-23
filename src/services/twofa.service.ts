import QRCode from "qrcode";
import speakeasy from "speakeasy";
import { decrypt, encrypt } from "../utils/encryption";

export const generate2FA = async (email: string) => {
    const secret = speakeasy.generateSecret({
        name: `MySilva (${email})`,
    });

    const encryptedSecret = encrypt(secret.base32);

    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return {
        encryptedSecret,
        qrCode,
    };
};

export const verify2FA = (encryptedSecret: string, token: string) => {
    const secret = decrypt(encryptedSecret);

    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
    });
};