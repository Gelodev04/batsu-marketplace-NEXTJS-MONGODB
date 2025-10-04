import { Schema, model, models } from "mongoose";
import { arrayMinLength } from "@/lib/validator";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ["new", "used"], required: true },
    images: {
      type: [String],
      required: true,
      validate: [arrayMinLength(1), "At least one image is required"],
    },

    sold: { type: Boolean, default: false },
    tags: {
      type: [String],
      required: true,
      validate: [arrayMinLength(1), "At least one tag is required"],
    },

    // who created it (you can also store campus if needed)
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerEmail: { type: String, required: true },
    sellerCampus: {
      type: String,
      enum: ["alangilan", "pablo-borbon"],
      required: true,
    },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
