import FlexibleTable from "src/shared/components/data-display/FlexibleTable/FlexibleTable"

import "./Table.css"
import { Mantenimiento, useGetEnergeticosQuery } from "src/gql/schema"
import { FlexibleTableRow } from "src/shared/components/data-display/FlexibleTable/flexible-table-items.interface"
import { useProfile } from "src/shared/hooks/useProfile"
import { useDate } from "src/shared/hooks/useDate"
import { ForwardedRef, forwardRef, useImperativeHandle, useMemo, useState } from "react"
import { tableSkeletonRows } from "src/shared/components/layout/skeleton/TableSkeleton/TableSkeleton"
import { getMonthRange } from "../../helpers/getMonthRange"
import useIsColaboradorActive from "src/shared/hooks/useIsColaboradorActive"
import TablePaginatorWrapper from "src/shared/components/data-display/FlexibleTable/sections/TablePaginatorWrapper/TablePaginatorWrapper"
import genTableRows from "./helpers/genTableRows"
import EmptyState from "src/shared/components/layout/empty-state/EmptyState"
import { AddButton } from "src/pages/gastos/components/AddButton/AddGasto"

export interface EnergeticoData {
    agua: number
    gas: number
    luz: number
    mantenimiento_id: string
    responsable: {
        id: string
        name: string
    }
}

const headers = [
    { value: "No. Corte" },
    { value: "Turno" },
    { value: "Fecha de registro" },
    { value: "Agua" },
    { value: "Gas" },
    { value: "Luz" },
    { value: "Responsable" },
    { value: "Acciones" },
]

export interface TableMantenimientoRef {
    refetch: () => void
}

function getDateStatus(startDate: Date): "past" | "current" | "future" {
    const now = new Date()

    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() // 0-11

    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()

    if (startYear < currentYear || (startYear === currentYear && startMonth < currentMonth)) {
        return "past"
    }

    if (startYear === currentYear && startMonth === currentMonth) {
        return "current"
    }

    return "future"
}

const MantenimientoTable = (
    { onEdit, startDate, onAdd }: { onEdit: (data: EnergeticoData) => void; startDate: Date; onAdd: () => void },
    ref: ForwardedRef<TableMantenimientoRef | null>
) => {
    const { hotel_id } = useProfile()
    const { InactiveModal, validateIsColabActive } = useIsColaboradorActive()
    const { localDateToUTCString } = useDate()
    const { skeletonRows } = tableSkeletonRows({ headers })
    const [showGradient, setShowTopGradient] = useState(false)

    const dates = getMonthRange(startDate)

    const { data, refetch, loading } = useGetEnergeticosQuery({
        variables: {
            hotel_id,
            fecha_registro: {
                fecha_inicial: localDateToUTCString(dates.start),
                fecha_final: localDateToUTCString(dates.end),
            },
        },
    })

    const [page, setPage] = useState(1)
    const rowsPerPage = 10

    useImperativeHandle(ref, () => ({ refetch }))

    const tableRows: FlexibleTableRow[] = genTableRows({
        mantenimientos: (data?.mantenimientos as Mantenimiento[]) || [],
        onEdit: validateIsColabActive((data) => onEdit(data)),
    })

    const paginatedRows = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage
        const endIndex = startIndex + rowsPerPage
        return tableRows.slice(startIndex, endIndex)
    }, [tableRows, page])

    if (!paginatedRows.length && showGradient) {
        setShowTopGradient(false)
    }

    return (
        <div className="mantenimiento__table__container">
            <div
                className={`mantenimiento__table__wrapper${
                    showGradient ? " mantenimiento__table__wrapper--show-gradient" : ""
                }`}
                style={{ justifyContent: paginatedRows.length ? "flex-start" : "center",  borderRadius: "0 0 20px 0" }}
            >
                {!loading && !paginatedRows.length ? (
                    ["past", "current"].includes(getDateStatus(startDate)) ? (
                        <EmptyState
                            title="No tienes lecturas registradas"
                            headerIcon="tools"
                            subtitle="Compuenza registrando las lecturas de gas, luz y agua aquí"
                            button="Agregar lectura"
                            onClick={onAdd}
                        />
                    ) : (
                        <EmptyState
                            title="No tienes lecturas registradas"
                            headerIcon="tools"
                            subtitle="Este mes todavía no comienza, pero aquí verás las lecturas conforme se vayan generando."
                        />
                    )
                ) : (
                    <FlexibleTable
                        tableItems={{
                            headers,
                            rows: loading ? skeletonRows : paginatedRows,
                        }}
                        emptyState={{
                            headerIcon: "tools",
                        }}
                        onHasScrollChange={setShowTopGradient}
                    />
                )}
            </div>

            <div className="mantenimiento__paginator__wrapper">
                <TablePaginatorWrapper
                    currentPage={page}
                    onChange={(p) => setPage(p)}
                    pages={Math.ceil(tableRows.length / rowsPerPage) || 1}
                >
                    {null}
                </TablePaginatorWrapper>
            </div>
            {InactiveModal}
            {!!paginatedRows.length && <AddButton onAdd={onAdd} />}
        </div>
    )
}

export default forwardRef(MantenimientoTable)
