import { Skeleton } from "@/components/ui/Skeleton/Skeleton"

const IncidenceSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-4 px-4 w-full mx-auto">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4 w-full">
                    <Skeleton className="w-[48px] h-[48px] rounded-full shrink-0" />
                    <div className="w-full">
                        <Skeleton className="h-4 w-[60%] mb-4" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-[90%]" />
                            <Skeleton className="h-4 w-[70%]" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default IncidenceSkeleton
