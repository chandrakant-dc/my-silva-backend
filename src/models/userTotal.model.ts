import mongoose, { Document, Schema } from "mongoose";

export interface IUserTotal extends Document {
    userId: mongoose.Types.ObjectId;
    totalTime: number; // in seconds
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userTotalSchema = new Schema<IUserTotal>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        totalTime: {
            type: Number,
            default: 0,
        },
        lastActive: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

userTotalSchema.index({ userId: 1 });

export const UserTotal = mongoose.model<IUserTotal>(
    "UserTotal",
    userTotalSchema
);