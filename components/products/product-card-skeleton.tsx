"use client";

export default function ProductCardSkeleton() {
  return (
    <li className="rounded-md border p-4 animate-pulse">
      <div className="mb-3 h-40 w-full rounded-md bg-muted" />
      <div className="h-4 w-2/3 bg-muted rounded" />
      <div className="mt-2 h-3 w-full bg-muted rounded" />
      <div className="mt-3 flex items-center justify-between">
        <div className="h-4 w-16 bg-muted rounded" />
        <div className="h-3 w-28 bg-muted rounded" />
      </div>
      <div className="mt-2 flex gap-1">
        <div className="h-4 w-10 bg-muted rounded" />
        <div className="h-4 w-12 bg-muted rounded" />
        <div className="h-4 w-8 bg-muted rounded" />
      </div>
    </li>
  );
}
