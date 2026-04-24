import mongoose, { Document, model, Schema } from "mongoose";

export interface IUserSubscription extends Document {
    user: mongoose.Types.ObjectId;
    plan: mongoose.Types.ObjectId;
    subscriptionStatus: "unsubscribed" | "pending" | "activated";
    receiptUrl?: string;
    startDate?: Date;
    endDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSubscriptionSchema = new Schema<IUserSubscription>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        plan: {
            type: Schema.Types.ObjectId,
            ref: "Plan",
            required: true,
        },
        subscriptionStatus: {
            type: String,
            enum: ["unsubscribed", "pending", "activated"],
            default: "pending",
        },
        receiptUrl: {
            type: String,
            default: "",
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const UserSubscription = model<IUserSubscription>(
    "UserSubscription",
    UserSubscriptionSchema
);

export default UserSubscription;
