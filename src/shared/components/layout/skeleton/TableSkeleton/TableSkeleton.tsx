import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"
import { Props } from "./TableSkeleton.type"
import Skeleton from "../Skeleton"
import { useEffect, useState } from "react"
import useSortTable from "src/shared/hooks/useSortTable"
import "./TableSkeleton.css"
import {
    FlexibleTableHeaderColumn,
    FlexibleTableRow,
} from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"

export function TableSkeleton({ headers = [], wrapperClassName, wrapperStyle }: Props): JSX.Element {
    const tableItemsEmpty = () => {
        const indData = { value: "" }
        const conjData = [{ value: "" }]
        headers.map(() => {
            conjData.push(indData)
        })
        conjData.pop()
        const valueData = { value: conjData }
        const conjValueData = [valueData]
        const numberRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
        numberRows.map(() => {
            conjValueData.push(valueData)
        })
        return conjValueData
    }

    const [sortedData, setsortedDataCortesEmpty] = useState(tableItemsEmpty) // Almacena los datos ordenados
    const [onSortDataEmpty] = useState<{
        sort: "up" | "down" | null
        fromHeader: string
        idx: number
    } | null>(null) // Almacena los datos ordenados

    useEffect(() => {
        const sortDataEmpty = useSortTable({
            sortState: onSortDataEmpty?.sort || null,
            sortedData,
            i: onSortDataEmpty?.idx || 0,
        })
        setsortedDataCortesEmpty(sortDataEmpty)
    }, [onSortDataEmpty])

    return (
        <div className={`table-skeleton-container ${wrapperClassName ? wrapperClassName : ""}`} style={wrapperStyle}>
            <FlexibleTable
                tableItems={{
                    ...{
                        headers: headers,
                        rows: sortedData.map((row) => ({
                            value: row.value.map(() => ({
                                value: (
                                    <div className="">
                                        <Skeleton elements={1} className="table-skeleton-base" />
                                    </div>
                                ),
                            })),
                        })),
                    },
                }}
            ></FlexibleTable>
        </div>
    )
}

export function tableSkeletonRows({ headers = [] }: { headers: FlexibleTableHeaderColumn[] }): {
    skeletonRows: FlexibleTableRow[]
} {
    const skeletonRows: FlexibleTableRow[] = Array.from({ length: 8 }).map(() => ({
        value: headers.map(() => ({
            value: (
                <div className="">
                    <Skeleton elements={1} className="table-skeleton-base" />
                </div>
            ),
        })),
    }))

    return { skeletonRows }
}
