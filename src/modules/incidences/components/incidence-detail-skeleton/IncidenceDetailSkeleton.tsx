import { Skeleton } from "@/components/ui/Skeleton/Skeleton"

const IncidenceDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-4  py-3">
      <Skeleton className="w-[360px] h-[20px] rounded-[10px]" />
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="w-[160px] h-4 rounded" />
          <Skeleton className="w-full h-4 rounded" />
        </div>
      ))}

      <div className="space-y-2">
        <Skeleton className="w-[200px] h-4 rounded" />
        <Skeleton className="w-full h-4 rounded" />
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-[90px] w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}

export default IncidenceDetailSkeleton
