import { model, Schema } from "mongoose";

export interface CategoryI {
    name: string;
}

const categorySchema = new Schema<CategoryI>({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
})

const Category = model("Categories", categorySchema);

export default Category;