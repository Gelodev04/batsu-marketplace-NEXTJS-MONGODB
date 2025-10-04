import { StringToBoolean } from "class-variance-authority/types";

export type Condition = "new" | "used";

export type CreateProductPayload = {
  title: string;
  description: string;
  price: number;
  stock: number;
  condition: Condition;
  images?: string[];
  sold?: boolean;
  tags?: string[];
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  condition: Condition;
  images: string[];
  sold: boolean;
  tags: string[];
  sellerId: string;
  sellerEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type GetMyProductsResponse = {
  products: Product[];
};

export type DeleteProductsPayload = {
  productIds: string[];
};

export type DeleteProductsResponse = {
  deletedCount: number;
  message: string;
};

export type UpdateProductPayload = {
  title?: string;
  description?: string;
  price?: number;
  stock?: number;
  condition?: Condition;
  images?: string[];
  sold?: boolean;
  tags?: string[];
};

export type UpdateProductResponse = {
  product: Product;
  message: string;
};
