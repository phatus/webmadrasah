
export function NewsCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white animate-pulse">
            <div className="h-48 w-full bg-gray-200" />
            <div className="flex flex-1 flex-col justify-between p-6">
                <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                    <div className="h-6 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-6 w-2/3 bg-gray-200 rounded mb-4" />
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}
