export function RepoSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg border border-gray-200 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-4" />
          <div className="flex gap-2">
            <div className="h-3 bg-gray-100 rounded w-16" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
