import mongoose, { model, Schema } from "mongoose";

interface TopicI {
    category: mongoose.Types.ObjectId;
    subcategory: mongoose.Types.ObjectId;
    topicName: string;
    description: string;
}

const TopicSchema = new Schema<TopicI>({
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: "SubCategories",
        required: true
    },
    topicName: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

const Topic = model("Topics", TopicSchema);

export default Topic;