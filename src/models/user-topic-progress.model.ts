import mongoose, { model, Schema } from "mongoose";

interface UserTopicProgressI {
    user: mongoose.Types.ObjectId;
    topic: mongoose.Types.ObjectId;
    subcategory: mongoose.Types.ObjectId;
    status: "pending" | "completed",
    completedAt: Date
}

const UserTopicProgressSchema = new Schema<UserTopicProgressI>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topic",
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategories"
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    completedAt: Date
}, { timestamps: true });

// prevent duplicate entries
UserTopicProgressSchema.index({ user: 1, topic: 1 }, { unique: true });


const UserTopicProgresses = model('UserTopicProgresses', UserTopicProgressSchema);

export default UserTopicProgresses;