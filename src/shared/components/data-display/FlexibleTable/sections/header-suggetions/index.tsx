import { ReactNode, useContext, useEffect, useRef, useState } from "react"
import Suggestions from "./Suggestions"
import { FilterMenuItem, FlexibleTableHeaderColumn } from "../../flexible-table-items.interface"
import { FiltersContext } from "../../context/table.context"
import { computePosition } from "@floating-ui/react"
import { autoUpdate, flip, shift } from "@floating-ui/dom"
import { useEffectClickOutside } from "src/shared/hooks"
import Icon from "src/shared/icons"

interface HeaderSuggetionsProps {
    header: FlexibleTableHeaderColumn
    onSelectFilter: ({
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
    onBottomReached?: () => void
    debounceSearchMSTime?: number
}

function HeaderSuggetions({
    header,
    onSelectFilter,
    onBottomReached,
    debounceSearchMSTime,
}: HeaderSuggetionsProps): JSX.Element {
    const [visible, setVisible] = useState<boolean>(false)

    const floatingRef = useRef<HTMLDivElement>(null)
    const headerRef = useRef<HTMLTableCellElement>(null)

    const { selectedFilters } = useContext(FiltersContext)

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
                if (floatingRef.current?.style) {
                    Object.assign(floatingRef.current.style, {
                        top: `${y + 5}px`,
                        left: `${x}px`,
                    })
                }
            })
        }

        const cleanup = autoUpdate(headerRef.current, floatingRef.current, update)

        // limpiar al desmontar
        return cleanup
    }, [visible, header.filterMenu])

    useEffectClickOutside(headerRef, () => setVisible(false))

    const handleBottomReached = () => {
        onBottomReached?.()
    }

    const filteredSelectedHeaders =
        (selectedFilters
            ?.filter((f) => f.fromHeader === header.value)
            ?.map((f) => ({
                value: f.filter,
                valueToDisplay: f.valueToDisplay,
            }))
            .sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase())) as FilterMenuItem[]) || []

    const filteredHeaders =
        header.filterMenu?.filter((f) => !selectedFilters?.find((sf) => sf.filter === f.value)) || []

    const onClose = () => {
        setVisible(false)
    }

    return (
        <th
            ref={headerRef}
            className="flexible-table__header__cell flexible-table__header__cell--pointer"
            onClick={() => setVisible(true)}
        >
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5px",
                }}
            >
                <span className="flexible-table__header__cell-text">{header.valueToDisplay || header.value}</span>
                {filteredSelectedHeaders.length ? (
                    <Icon name="filterFill" color="var(--primary)" height={"14px"} width={"14px"} />
                ) : (
                    <Icon name={"chevronUp"} color="var(--purple-drawer-primario)" height={"20px"} width={"20px"} />
                )}
            </div>
            {visible && (
                <div style={{ position: "relative" }}>
                    <Suggestions
                        onClose={onClose}
                        onBottomReached={handleBottomReached}
                        ref={floatingRef}
                        options={
                            header.filterMenu?.length
                                ? [...filteredSelectedHeaders, ...filteredHeaders]
                                : // : [{ valueToDisplay: "Todos", value: "todos" }]
                                  [...filteredSelectedHeaders]
                        }
                        debounceSearchMSTime={debounceSearchMSTime}
                        header={header}
                        onInputFilterSuggestionChange={header.onInputFilterSuggestionChange}
                        onChange={(value, valueToDisplay) => {
                            onSelectFilter({
                                filter: value,
                                fromHeader: header.value,
                                valueToDisplay,
                                isUnique: header.isFilterUnique,
                            })
                        }}
                    />
                </div>
            )}
        </th>
    )
}

export default HeaderSuggetions
