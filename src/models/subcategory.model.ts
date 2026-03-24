import mongoose, { model, Schema } from "mongoose";

export interface SubCategoryI {
    name: string;
    category: mongoose.Types.ObjectId;
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
    }
}
)

const SubCategory = model("SubCategories", subcategorySchema);

export default SubCategory;