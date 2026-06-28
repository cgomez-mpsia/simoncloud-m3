export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}

export function DropCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="w-5 h-5 rounded mt-0.5 shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FileCardSkeleton() {
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-start gap-2">
        <Skeleton className="w-4 h-4 mt-0.5 shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="w-16 h-7 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-full rounded-lg" />
    </div>
  );
}
