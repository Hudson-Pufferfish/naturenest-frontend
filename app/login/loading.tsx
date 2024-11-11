export default function Loading() {
  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mx-auto mb-8" />
      <div className="border p-8 rounded-md shadow-sm">
        <div className="space-y-4">
          <div>
            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse mt-6" />
      </div>
    </div>
  );
}
