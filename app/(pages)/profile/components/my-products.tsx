"use client";

import { useState } from "react";
import ProductCard from "@/components/products/product-card";
import ProductCardSkeleton from "@/components/products/product-card-skeleton";
import { Button } from "@/components/ui/button";
import { useMyProducts } from "../hooks/useMyProducts";
import { deleteProducts } from "../services/product";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function MyProducts() {
  const { data, error, mutate } = useMyProducts();
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectProduct = (productId: string, selected: boolean) => {
    setSelectedProducts((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (!data?.products) return;

    const allProductIds = data.products.map((p) => p._id);
    if (checked) {
      setSelectedProducts(new Set(allProductIds));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedProducts.size === 0) return;

    setIsDeleting(true);
    try {
      const result = await deleteProducts({
        productIds: Array.from(selectedProducts),
      });

      if (result.ok) {
        toast.success(result.data!.message);
        setSelectedProducts(new Set());
        mutate(); // Refresh the data
      } else {
        toast.error(result.error || "Failed to delete products");
      }
    } catch (error) {
      toast.error("Failed to delete products");
    } finally {
      setIsDeleting(false);
    }
  };

  // Loading state
  if (!data && !error) {
    return (
      <div className="space-y-4">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">Failed to load products.</p>;
  }

  const products = data?.products ?? [];

  if (!products.length) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven't added any products yet.
      </p>
    );
  }

  const allSelected =
    products.length > 0 && selectedProducts.size === products.length;
  const someSelected = selectedProducts.size > 0;

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            className="h-4 w-4"
          />
          <span className="text-sm text-muted-foreground">
            {selectedProducts.size > 0
              ? `${selectedProducts.size} selected`
              : "Select all"}
          </span>
        </div>

        {someSelected && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            disabled={isDeleting}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : `Delete (${selectedProducts.size})`}
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            showCheckbox={true}
            isSelected={selectedProducts.has(product._id)}
            onSelect={handleSelectProduct}
          />
        ))}
      </ul>
    </div>
  );
}
