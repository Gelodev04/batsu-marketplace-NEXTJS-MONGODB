import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileHeaderSkeleton() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="w-24 h-9" />
      </div>

      {/* Loading placeholders for buttons */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="w-32 h-9" />
        <Skeleton className="w-20 h-9" />
      </div>
    </div>
  );
}
