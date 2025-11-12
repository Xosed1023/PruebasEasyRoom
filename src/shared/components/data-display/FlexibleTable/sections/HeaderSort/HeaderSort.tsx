import React, { useEffect, useRef, useState } from "react"
import Icon from "src/shared/icons"
import { FlexibleTableHeaderColumn } from "../../flexible-table-items.interface"
import "./HeaderSort.css"
import { computePosition, autoUpdate } from "@floating-ui/react"
import { flip, shift } from "@floating-ui/dom"
import { useEffectClickOutside } from "src/shared/hooks"

const HeaderSort = ({
    header,
    sortValues,
    sortFilterVAlue,
}: {
    header: FlexibleTableHeaderColumn
    sortValues: (value: "up" | "down" | null) => void
    sortFilterVAlue: {
        sort: "up" | "down" | null
        fromHeader: string
    } | null
}) => {
    const [open, setOpen] = useState(false)
    const headerRef = useRef<any>(null)
    const floatingRef = useRef<HTMLDivElement>(null)

    const handleSortClick = () => {
        setOpen(true)
    }

    useEffectClickOutside(headerRef, () => setOpen(false))

    useEffect(() => {
        if (!headerRef.current || !floatingRef.current) {
            return
        }
        const update = () => {
            if (!headerRef.current || !floatingRef.current) {
                return
            }
            computePosition(headerRef.current, floatingRef.current, {
                placement: "bottom-start",
                middleware: [flip(), shift()],
            }).then(({ x, y }) => {
                Object.assign(floatingRef!.current!.style, {
                    top: `${y + 5}px`,
                    left: `${x}px`,
                })
            })
        }
        const cleanup = autoUpdate(headerRef.current, floatingRef.current, update)

        // limpiar al desmontar
        return cleanup
    }, [open])

    const handleSelectSort = (sort: "up" | "down") => {
        setOpen(false)
        sortValues(sort)
    }

    return (
        <th
            className="flexible-table__header__cell flexible-table__cell--sort flexible-table__header__cell--pointer"
            ref={headerRef}
            onClick={handleSortClick}
        >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="flexible-table__header__cell-text" style={{ marginRight: "3px" }}>
                    {header.valueToDisplay || header.value}
                </span>
                <Icon name={"sort"} color="var(--purple-drawer-primario)" />
            </div>
            {open && (
                <div className="flexible-table__cell--sort__menu" ref={floatingRef}>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            handleSelectSort("down")
                        }}
                        className={`flexible-table__cell--sort__menu__item ${
                            sortFilterVAlue?.fromHeader === header.value && sortFilterVAlue.sort === "down"
                                ? "flexible-table__cell--sort__menu__item--active"
                                : ""
                        }`}
                    >
                        <span className="flexible-table__cell--sort__menu__text">De mayor a menor</span>
                    </div>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            handleSelectSort("up")
                        }}
                        className={`flexible-table__cell--sort__menu__item ${
                            sortFilterVAlue?.fromHeader === header.value && sortFilterVAlue.sort === "up"
                                ? "flexible-table__cell--sort__menu__item--active"
                                : ""
                        }`}
                    >
                        <span className="flexible-table__cell--sort__menu__text">De menor a mayor</span>
                    </div>
                </div>
            )}
        </th>
    )
}

export default HeaderSort
