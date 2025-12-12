import { ReactNode } from "react"

type SortableData<T> = {
    value: {
        value: JSX.Element | string | ReactNode
        sortValue?: string
        fromHeaderSort?: string
    }[]
} & T

const useSortTable = <T extends object>({
    sortState,
    sortedData,
    startList,
    i,
}: {
    sortState: "up" | "down" | null
    startList?: SortableData<T>[]
    sortedData: SortableData<T>[]
    i: number
}): SortableData<T>[] => {
    if (sortState === null && startList) {
        return [...startList]
    }

    const sorted = [...sortedData]?.sort((a, b) => {
        const sortValueA = a.value[i]?.sortValue ?? (a.value[i]?.value as string) ?? ""
        const sortValueB =  b.value[i]?.sortValue ?? (b.value[i]?.value as string) ?? "";

        if (typeof sortValueA === "string" && typeof sortValueB === "string") {
            return sortState === "up" ? sortValueA.localeCompare(sortValueB) : sortValueB.localeCompare(sortValueA)
        }

        if (!isNaN(Number(sortValueA)) && !isNaN(Number(sortValueB))) {
            return sortState === "up"
                ? Number(sortValueA) - Number(sortValueB)
                : Number(sortValueB) - Number(sortValueA)
        }

        return 0
    })

    return sorted
}

export default useSortTable
