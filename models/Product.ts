import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ["new", "used"], required: true },
    images: { type: [String], default: [] }, 
    sold: { type: Boolean, default: false },
    tags: { type: [String], default: [] },

    // who created it (you can also store campus if needed)
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerEmail: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;