"use client";
import useSWR from "swr";
import ProductCard from "@/components/products/product-card";
import ProductCardSkeleton from "@/components/products/product-card-skeleton";
import type { Product } from "@/services/products/product";
import { fetcher } from "@/lib/fetcher";

type GetMyProductsResponse = { products: Product[] };

export default function MyProducts() {
  const { data, error } = useSWR<GetMyProductsResponse>(
    "/api/products",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (!data && !error) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </ul>
    );
  }

  if (error)
    return <p className="text-sm text-red-500">Failed to load products.</p>;

  const products = data?.products ?? [];
  if (!products.length)
    return (
      <p className="text-sm text-muted-foreground">
        You haven’t added any products yet.
      </p>
    );

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </ul>
  );
}
