import mongoose, { Document, Schema } from "mongoose";

export interface IUserDaily extends Document {
    userId: mongoose.Types.ObjectId;
    date: string; // "YYYY-MM-DD"
    time: number; // in seconds
    createdAt: Date;
    updatedAt: Date;
}

const userDailySchema = new Schema<IUserDaily>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        time: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);


userDailySchema.index({ userId: 1, date: 1 }, { unique: true });

export const UserDaily = mongoose.model<IUserDaily>(
    "UserDaily",
    userDailySchema
);