import mongoose, { model, Schema } from "mongoose";

export interface SubCategoryI {
    name: string;
    category: mongoose.Types.ObjectId;
    image: string;
    description: string;
}

const subcategorySchema = new Schema<SubCategoryI>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
}
)

const SubCategory = model("SubCategories", subcategorySchema);

export default SubCategory;