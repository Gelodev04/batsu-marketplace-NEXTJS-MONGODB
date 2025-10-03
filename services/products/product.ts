import { CreateProductPayload } from "@/types";
import { ApiResult } from "@/types";
import { Product } from "@/types";

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

