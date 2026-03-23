import crypto from "crypto";

const ALGO = "aes-256-cbc";
const encryptKey = process.env.ENCRYPTION_KEY || "";
const KEY = crypto
    .createHash("sha256")
    .update(encryptKey)
    .digest(); // 32 bytes

export const encrypt = (text: string) => {
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    const encrypted = Buffer.concat([
        cipher.update(text),
        cipher.final(),
    ]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text: string) => {
    const [ivHex, encryptedHex] = text.split(":");

    const iv = Buffer.from(ivHex || "", "hex");
    const encryptedText = Buffer.from(encryptedHex || "", "hex");

    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);

    const decrypted = Buffer.concat([
        decipher.update(encryptedText),
        decipher.final(),
    ]);

    return decrypted.toString();
};