import React, {
    forwardRef,
    Ref,
    TableHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useState,
    useRef,
    useContext,
    ReactNode,
} from "react"
import { FlexibleTableItems, FlexibleTableRow } from "./flexible-table-items.interface"
import cx from "classnames"
import { v4 as uuid } from "uuid"

import "./FlexibleTable.css"
import HeaderCell from "./sections/header-cell/HeaderCell"
import { FiltersContext, TableFiltersProvider } from "./context/table.context"
import BodyRow from "./sections/BodyRow/BodyRow"
import HeaderSort from "./sections/HeaderSort/HeaderSort"
import EmptyState from "../../layout/empty-state/EmptyState"
import { COLLECTION } from "src/shared/icons/Icon"
import HeaderSuggetions from "./sections/header-suggetions"

export interface FlexibleTableRowWithid extends FlexibleTableRow {
    id: string
}

export interface TableFilter {
    filter: string
    fromHeader: string
    idx: number
}

export interface SortFilterValue {
    sort: "up" | "down" | null
    fromHeader: string
    idx: number
}

export type SortFunction = (sortFilterVAlue: SortFilterValue | null) => void

export interface FlexibleTableProps extends TableHTMLAttributes<HTMLTableElement> {
    blockMargin?: boolean
    sticky?: boolean
    tableItems: FlexibleTableItems
    containterClassName?: string
    // Función que se ejecuta al dar click en la celda con flecha a la derecha, utilizado para redirecciones
    goTo?: (path: string) => void
    // Función que se ejecuta al seleccionar un filtro, de momento se abstrae el cómo se quitan o agregan filas para que lo haga el componente padre que implementa esta tabla, debido a que se espera que por cada vez que se seleccione un filtro se haga una petición http con esos filtros seleccionados o no... de cualquier forma son cosas que no puede controlar esta tabla directamente
    onSelectedFilters?: (filters: TableFilter[]) => void
    onHasScrollChange?: (hasScroll: boolean) => void
    onHasXScrollChange?: (hasScroll: boolean) => void

    // onScroll: no se implementa aquí porque eso va en un elemento que envuelve a este componente, este componente se envuelve en un div con un alto determinado y un overflow: scroll y un onScroll por ejemplo para escuchar cuando se llegue al final de la tabla para cargar más registros (infinite scroll)
    onSort?: SortFunction
    maxCellWidth?: string | number
    emptyState?: {
        titile?: string
        subTitle?: string
        button?: string
        headerIcon?: keyof typeof COLLECTION | (string & {})
        onClick?: () => void
    }
    onLoad?: () => void
}

export interface FlexibleTableRef {
    setFiltersFromOuterState: (filters: TableFilter[]) => void
}

const FlexibleTableChild = forwardRef(
    (
        {
            tableItems: { headers, rows },
            goTo,
            onSelectedFilters,
            onHasScrollChange,
            onHasXScrollChange,
            onSort,
            emptyState,
            blockMargin = false,
            sticky = false,
            maxCellWidth,
            onLoad,
            className,
            containterClassName,
            ...props
        }: FlexibleTableProps,
        ref?: Ref<FlexibleTableRef>
    ) => {
        const { selectedFilters, setSelectedFilters } = useContext(FiltersContext)
        const [sortFilterVAlue, setSortFilterVAlue] = useState<{
            sort: "up" | "down" | null
            fromHeader: string
            idx: number
        } | null>(null) // Estado de clasificación
        const onSelectFilter = ({
            filter,
            fromHeader,
            idx,
            isUnique,
            valueToDisplay,
        }: {
            filter: string
            fromHeader: string
            idx: number
            isUnique?: boolean
            valueToDisplay?: ReactNode
        }) => {

            const filterAlreadySelected = selectedFilters?.find(
                (item) => item.fromHeader === fromHeader && item.filter === filter && item.idx === idx
            )

            if (filterAlreadySelected) {
                return setSelectedFilters?.(selectedFilters?.filter((item) => item !== filterAlreadySelected))
            }
            if (isUnique) {
                if (!selectedFilters?.length) {
                    return setSelectedFilters?.([{ filter, fromHeader, idx, valueToDisplay }])
                }
                const selectedFiltersWithoutFilterToUpdate = selectedFilters.filter((f) => f.fromHeader !== fromHeader)
                return setSelectedFilters?.([
                    ...selectedFiltersWithoutFilterToUpdate,
                    { filter, fromHeader, idx, valueToDisplay },
                ])
            }
            return setSelectedFilters?.([...(selectedFilters || []), { filter, fromHeader, idx, valueToDisplay }])
        }

        const setFiltersFromOuterState = (filters: TableFilter[]) => {
            setSelectedFilters?.(filters)
        }

        const containerRef = useRef<HTMLDivElement>(null)

        useImperativeHandle(ref, () => {
            return {
                setFiltersFromOuterState,
            }
        })

        useEffect(() => {
            containerRef.current?.focus()
        }, [])

        useEffect(() => {
            onLoad?.()
        }, [])

        useEffect(() => {
            onSelectedFilters?.(selectedFilters || [])
        }, [selectedFilters])

        const onSortFilter = (sort: "up" | "down" | null, fromHeader: string, idx: number) => {
            setSortFilterVAlue({ sort, fromHeader, idx })
            if (onSort) onSort({ sort, fromHeader, idx }) // Llama a la función onSort con los valores adecuados
        }

        const [selectedRowId, setSelectedRowId] = useState<string>()

        const [bodyRows, setBodyRows] = useState<FlexibleTableRowWithid[]>(rows?.map((row) => ({ ...row, id: uuid() })))
        useEffect(() => {
            setBodyRows(rows?.map((row) => ({ ...row, id: uuid() })))
        }, [rows])

        useEffect(() => {
            const el = containerRef.current
            if (!el) return

            const checkScroll = () => {
                if(!bodyRows?.length) {
                    onHasScrollChange?.(false)
                    onHasXScrollChange?.(false)
                    return
                }
                const hasScroll = el.scrollHeight > el.clientHeight
                const hasScrollX = el.scrollWidth > el.clientWidth
                if (onHasScrollChange) onHasScrollChange(hasScroll)
                if (onHasXScrollChange) onHasXScrollChange(hasScrollX)
            }

            checkScroll() // Al montar o al cambiar filas

            // Actualiza también en resize
            window.addEventListener("resize", checkScroll)
            return () => {
                window.removeEventListener("resize", checkScroll)
            }
        }, [bodyRows, onHasScrollChange])

        return (
            <>
                <div
                    className={cx(
                        "flexible-table-container",
                        containterClassName,
                        sticky ? "flexible-table-sticky" : "",
                    )}
                    style={{
                        overflow: bodyRows?.length ? "" : "hidden"
                    }}
                    ref={containerRef}
                    tabIndex={0}
                >
                    <table
                        {...{
                            ...props,
                            className: cx("flexible-table", className),
                            onScroll: (e) => console.log({ d: e.currentTarget.scrollHeight }),
                        }}
                    >
                        <thead className="flexible-table__header">
                            <tr>
                                {headers?.map((header, idx) => {
                                    return header.sort ? (
                                        <HeaderSort
                                            key={header.value}
                                            header={header}
                                            sortFilterVAlue={sortFilterVAlue}
                                            sortValues={(value) => {
                                                onSortFilter(value, header.value, idx)
                                            }}
                                        />
                                    ) : header.filterSuggetions ? (
                                        <HeaderSuggetions
                                            debounceSearchMSTime={header.debounceSearchMSTime}
                                            key={header.value}
                                            header={header}
                                            onBottomReached={header.onLoadMore}
                                            onSelectFilter={({ filter, fromHeader, isUnique, valueToDisplay }) =>
                                                onSelectFilter({ filter, fromHeader, idx, isUnique, valueToDisplay })
                                            }
                                        />
                                    ) : (
                                        <HeaderCell
                                            key={header.value}
                                            header={header}
                                            onSelectFilter={({ filter, fromHeader, isUnique, valueToDisplay }) =>
                                                onSelectFilter({ filter, fromHeader, idx, isUnique, valueToDisplay })
                                            }
                                        />
                                    )
                                })}
                            </tr>
                        </thead>

                        <tbody>
                            {bodyRows &&
                                bodyRows.length > 0 &&
                                bodyRows?.map((row) => (
                                    <BodyRow
                                        row={row}
                                        goTo={goTo}
                                        key={row.key || row.id}
                                        selectedRowId={selectedRowId}
                                        maxCellWidth={maxCellWidth}
                                        onSelectRow={(id) => setSelectedRowId(id)}
                                    ></BodyRow>
                                ))}
                            {blockMargin && <p className="flexible-table-block">{""}</p>}
                        </tbody>
                    </table>
                    {bodyRows && bodyRows.length <= 0 && (
                        <div className="emptyState__table">
                            <EmptyState
                                headerIcon={emptyState?.headerIcon || "Gear"}
                                title={emptyState?.titile || ""}
                                subtitle={emptyState?.subTitle || ""}
                                button={emptyState?.button || ""}
                                onClick={emptyState?.onClick}
                            />
                        </div>
                    )}
                </div>
            </>
        )
    }
)

export const FlexibleTable = forwardRef((props: FlexibleTableProps, ref?: Ref<FlexibleTableRef>) => {
    return (
        <TableFiltersProvider>
            <FlexibleTableChild {...props} ref={ref} />
        </TableFiltersProvider>
    )
})

export default FlexibleTable
