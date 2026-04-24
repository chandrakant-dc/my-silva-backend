import { Document, model, Schema } from "mongoose";

export interface IPlan extends Document {
    name: string;
    price: number;
    durationInDays: number;
    dailyLimit: number;
    createdAt: Date;
    updatedAt: Date;
}

const planSchema = new Schema<IPlan>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        durationInDays: {
            type: Number,
            required: true,
            min: 1,
        },
        dailyLimit: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Plan = model<IPlan>("Plan", planSchema);

export default Plan;