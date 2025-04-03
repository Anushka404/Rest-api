import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema( // its a function types
    {
        title: { type: "string", required: true },
        user: { type: Schema.Types.ObjectId, ref: "user"},
    },
    {
        timestamps: true,
    }
);
 
const Category = models.Category || model("Category", CategorySchema); // model is also a function

export default Category;