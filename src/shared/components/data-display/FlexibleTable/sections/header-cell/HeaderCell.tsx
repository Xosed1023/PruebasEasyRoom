import React, { ReactNode, useRef, useState } from "react"
import { FlexibleTableHeaderColumn } from "../../flexible-table-items.interface"

import "./HeaderCell.css"
import Icon from "src/shared/icons"
import FilterMenu from "../FilterMenu/FilterMenu"
import { useEffectClickOutside } from "src/shared/hooks"

const HeaderCell = ({
    header,
    onSelectFilter,
}: {
    header: FlexibleTableHeaderColumn
    onSelectFilter?: ({
        filter,
        fromHeader,
        isUnique,
        valueToDisplay,
    }: {
        filter: string
        fromHeader: string
        valueToDisplay?: ReactNode
        isUnique?: boolean
    }) => void
}) => {
    const headerRef = useRef<any>(null)

    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffectClickOutside(headerRef, () => {
        if (headerRef && headerRef.current) {
            setIsOpen(false)
        }
    })

    return header.filterMenu ? (
        <th
            className="flexible-table__header__cell flexible-table__header__cell--pointer"
            ref={headerRef}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div style={{ display: "flex", justifyContent: "space-between", gap: "5px" }}>
                {header.valueToDisplay && typeof header.valueToDisplay !== "string" ? (
                    header.valueToDisplay
                ) : (
                    <span className="flexible-table__header__cell-text" style={{ marginRight: "3px" }}>
                        {header.valueToDisplay || header.value}
                    </span>
                )}
                <Icon name={"chevronUp"} color="var(--purple-drawer-primario)" height={"20px"} width={"20px"} />
            </div>
            {isOpen ? (
                <FilterMenu
                    onClose={() => setIsOpen(false)}
                    filters={header.filterMenu}
                    onSelectFilter={(filter) =>
                        onSelectFilter?.({
                            filter,
                            fromHeader: header.value,
                            valueToDisplay: header.valueToDisplay,
                            isUnique: header.isFilterUnique,
                        })
                    }
                    fromHeader={header.value}
                />
            ) : null}
        </th>
    ) : (
        <th className="flexible-table__header__cell">
            {header.valueToDisplay && typeof header.valueToDisplay !== "string" ? (
                header.valueToDisplay
            ) : (
                <span className="flexible-table__header__cell-text">{header.valueToDisplay || header.value}</span>
            )}
        </th>
    )
}

export default HeaderCell
