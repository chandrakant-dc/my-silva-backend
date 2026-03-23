import jwt from 'jsonwebtoken';

export function generateAccessToken(userPayload: string | object | Buffer<ArrayBufferLike>) {
    const secret = process.env.JWT_SECRET || "";
    return jwt.sign(
        userPayload,
        secret,
        { expiresIn: '15m' }
    );
}