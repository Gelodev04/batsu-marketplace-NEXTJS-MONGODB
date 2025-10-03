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

export type ApiResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

export async function createProduct(
  payload: CreateProductPayload
): Promise<ApiResult<{ product: Product }>> {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || "Failed to create product" };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error" };
  }
}

