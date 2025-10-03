"use client";

import { useState } from "react";
import { createProduct as createProductService } from "@/services/products/product";
import type { CreateProductPayload } from "@/services/products/product";

export function useCreateProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const createProduct = async (payload: CreateProductPayload) => {
    setLoading(true);
    setError("");
    try {
      const result = await createProductService(payload);
      if (!result.ok) {
        setError(result.error || "Failed to create product");
      }
      return result;
    } catch {
      setError("Network error");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return { createProduct, loading, error, setError };
}
