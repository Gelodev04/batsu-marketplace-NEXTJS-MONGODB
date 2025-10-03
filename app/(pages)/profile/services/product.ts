import { DeleteProductsPayload, DeleteProductsResponse } from "@/types";
import { ApiResult } from "@/types";

export async function deleteProducts(
  payload: DeleteProductsPayload
): Promise<ApiResult<DeleteProductsResponse>> {
  try {
    const res = await fetch("/api/products/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || "Failed to delete products" };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Network error" };
  }
}
