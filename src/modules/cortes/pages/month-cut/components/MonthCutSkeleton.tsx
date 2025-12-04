import { Skeleton } from "@/components/ui/Skeleton/Skeleton"

const MonthCutSkeleton = () => {
    return (
        <div className="flex flex-col gap-3 mt-2 px-1 pb-10">

            {Array.from({ length: 20 }).map((_, i) => {
                const isThick = i % 2 === 0 
                const addBlockSpacing = i % 2 !== 0

                return (
                    <Skeleton
                        key={i}
                        className={`
                            rounded-[10px]
                            ${isThick ? "h-[20px] w-[90%]" : "h-[15px] w-[60%]"}
                          bg-[linear-gradient(90deg,rgba(212,193,255,0.4)_0%,rgba(212,193,255,0.4)_40%,#faf6fe_80%)]

                            ${addBlockSpacing ? "mb-4" : ""}
                        `}
                    />
                )
            })}

        </div>
    )
}

export default MonthCutSkeleton
