import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
    userId?: mongoose.Types.ObjectId;
    guestId?: string;
    totalTime: number;
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
        guestId: { type: String, required: false },
        totalTime: { type: Number, default: 0 },
        lastActive: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// Either userId OR guestId must exist
sessionSchema.index({ userId: 1 });
sessionSchema.index({ guestId: 1 });

export const GuestSession = mongoose.model<ISession>("GuestSession", sessionSchema);