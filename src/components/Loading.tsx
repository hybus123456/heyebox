"use client";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-2 border-zinc-200 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 ${sizeClasses[size]}`} />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">加载中...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function ToolCardSkeleton() {
  return (
    <div className="animate-pulse p-5 rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        </div>
      </div>
      <div className="flex gap-2 mt-auto pt-3 border-t border-zinc-100 dark:border-zinc-800">
        <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ToolCardSkeleton key={i} />
      ))}
    </div>
  );
}
