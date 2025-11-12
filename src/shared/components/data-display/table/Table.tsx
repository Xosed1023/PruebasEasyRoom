import React, { TableHTMLAttributes, useEffect, useState } from "react"
import Icon from "src/shared/icons"
import { TableItems } from "./table-items.interface"

import { v4 as uuid } from "uuid"

import "./Table.css"
import HeaderCell from "./sections/header-cell/HeaderCell"

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
    tableItems: TableItems
    // Función que se ejecuta al dar click en la celda con flecha a la derecha, utilizado para redirecciones
    goTo?: (path: string) => void,
    // Función que se ejecuta al seleccionar un filtro, de momento se abstrae el cómo se quitan o agregan filas para que lo haga el componente padre que implementa esta tabla, debido a que se espera que por cada vez que se seleccione un filtro se haga una petición http con esos filtros seleccionados o no... de cualquier forma son cosas que no puede controlar esta tabla directamente
    onSelectedFilters?: (filters: { filter: string, fromHeader: string }[]) => void
    // onScroll: no se implementa aquí porque eso va en un elemento que envuelve a este componente de componente, este componente se envuelve en un div con un alto determinado y un overflow: scroll y un onScroll por ejemplo para escuchar cuando se llegue al final de la tabla para cargar más registros (infinite scroll)
}

const Table = ({ tableItems: { headers, rows }, goTo, onSelectedFilters, ...props }: TableProps) => {
    // si alguna fila tiene el elemento goto para añadir la celda vacia a la derecha en el encabezado
    const [hasGoTo] = useState<boolean>(!!rows[0].goTo)
    // si alguna fila tiene el elemento goto para añadir la celda vacia a la izquierda en el encabezado
    const [hasSeen] = useState<boolean | undefined>(rows[0]?.seen)

    const [selectedFilters, setSelectedFilters] = useState<{ filter: string, fromHeader: string }[]>([])

    const onSelectFilter = (filter: string, fromHeader: string) => {
        const filters = selectedFilters.filter((item) => {
            return item.fromHeader === fromHeader && item.filter === filter
        })

        if (filters.length) {
            return setSelectedFilters(selectedFilters.filter((item) => {
                return !(item.fromHeader === fromHeader && item.filter === filter)
            }))
        }
        return setSelectedFilters([...selectedFilters, { filter, fromHeader }])
    }

    useEffect(() => {
        onSelectedFilters?.(selectedFilters)
    }, [selectedFilters])


    return (
        <table
            {...{ ...props, className: "table", onScroll: (e) => console.log({ d: e.currentTarget.scrollHeight }) }}
        >
            <thead className="table__header table__header__cell__text">
                <tr>
                    {hasSeen === undefined ? null : <th className="table__header__cell"></th>}
                    {headers.map((header, idx) => (
                        <HeaderCell key={uuid()} header={header} onSelectFilter={(filter, fromHeader) => onSelectFilter(filter, fromHeader)} />
                    ))}
                    {hasGoTo && <th className="table__header__cell"></th>}
                </tr>
            </thead>
            <tbody>
                {rows.map((row) => (
                    <tr key={uuid()} className={`${row.highlighted ? "table__body__row--highlight" : ""}`}>
                        {row.seen !== undefined && (
                            <td className={`table__body__cell table__body__cell--center`}>
                                {
                                    row.seen ? null : <Icon name={"dot"} />
                                }
                            </td>
                        )}
                        {row.value.map((data) => (
                            <td
                                key={uuid()}
                                className={`table__body__cell ${data.boldText ? "table__body__cell-text--bold" : "table__body__cell-text"} $`}
                            >
                                {data.value}
                            </td>
                        ))}
                        {row.goTo && (
                            <td
                                className="table__body__cell table__body__cell-text table__body__cell-text--goTo"
                                onClick={() => goTo?.(row.goTo || "")}
                            >
                                <Icon name={"chevronRight"} />
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Table
