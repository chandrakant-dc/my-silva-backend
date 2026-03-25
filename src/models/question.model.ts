import mongoose, { model, Schema } from "mongoose";

export interface TopicQuestionsI {
    topic: mongoose.Types.ObjectId;
    question: string,
    option1: string,
    option2: string,
    option3: string,
    option4: string,
    answer: string
}


const QuestionSchema = new Schema<TopicQuestionsI>({
    topic: {
        type: Schema.Types.ObjectId,
        ref: "Topics",
        required: true
    },
    question: {
        type: String,
        required: true,
    },
    option1: String,
    option2: String,
    option3: String,
    option4: String,
    answer: String,
})

const Questions = model("Questions", QuestionSchema);

export default Questions;