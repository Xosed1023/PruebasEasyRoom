import { Skeleton } from "@/components/ui/Skeleton/Skeleton"

export const NotificationSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-6 s:px-[35px] xs:px-[20px] py-[20px] w-full mx-auto">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4 w-full">
                    <Skeleton className="w-[48px] h-[48px] rounded-full shrink-0" />
                    <div className="space-y-2 w-full">
                        <Skeleton className="h-4 w-[40%] s:w-[50%]" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[70%]" />
                    </div>
                </div>
            ))}
        </div>
    )
}
