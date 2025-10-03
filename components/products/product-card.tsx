"use client";

import Image from "next/image";
import type { Product } from "@/services/products/product";

type ProductCardProps = {
  product: Product;
  badge?: React.ReactNode; // e.g., Sold badge override
  onClick?: () => void;
  className?: string;
};

export function ProductCard({
  product,
  badge,
  onClick,
  className,
}: ProductCardProps) {
  const cover = product.images?.[0];

  return (
    <li
      className={`rounded-md border p-4 ${className ?? ""}`}
      onClick={onClick}
    >
      <div className="mb-3">
        {cover ? (
          <Image
            src={cover}
            alt={product.title}
            width={400}
            height={240}
            className="h-40 w-full rounded-md object-cover"
          />
        ) : (
          <div className="h-40 w-full rounded-md bg-muted" />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium">{product.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
        {badge ??
          (product.sold ? (
            <span className="shrink-0 rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
              Sold
            </span>
          ) : null)}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span className="font-semibold">₱{product.price}</span>
        <span className="text-muted-foreground">
          {product.condition === "new" ? "New" : "Used"} • Stock:{" "}
          {product.stock}
        </span>
      </div>

      {product.tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {product.tags.slice(0, 4).map((t) => (
            <span key={t} className="rounded bg-accent px-2 py-0.5 text-xs">
              #{t}
            </span>
          ))}
          {product.tags.length > 4 && (
            <span className="text-xs text-muted-foreground">
              +{product.tags.length - 4} more
            </span>
          )}
        </div>
      ) : null}
    </li>
  );
}

export default ProductCard;
