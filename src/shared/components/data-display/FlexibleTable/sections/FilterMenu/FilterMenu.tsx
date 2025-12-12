import { FilterMenuItem } from "../../flexible-table-items.interface"

import "./FilterMenu.css"
import Suggestion from "../header-suggetions/Suggestion"
import { useContext } from "react"
import { FiltersContext } from "../../context/table.context"

const FilterMenu = ({
    filters,
    onSelectFilter,
    fromHeader,
    onClose,
}: {
    filters: FilterMenuItem[]
    onSelectFilter?: (filter: string, fromHeader: string) => void
    fromHeader: string
    onClose: () => void
}) => {
    const { selectedFilters, setSelectedFilters } = useContext(FiltersContext)
    const selectedFiltersForThisHeader = selectedFilters?.filter((f) => f.fromHeader === fromHeader).length

    const onClearFilters = () => {
        setSelectedFilters?.(f => f?.filter(filt => filt.fromHeader !== fromHeader))
        onClose()
    }

    return (
        <div className="flexible-table__filter-menu__wrapper">
            <div className="flexible-table__filter-menu">
                <div
                    className="header-suggetions__item"
                    style={{ pointerEvents: !selectedFilters?.length ? "none" : "auto" }}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClearFilters()
                    }}
                >
                    <span className="header-suggestions__item-clear">
                        Borrar filtro {selectedFiltersForThisHeader ? `(${selectedFiltersForThisHeader})` : ""}
                    </span>
                </div>
                {filters.map((filter, index) => (
                    <Suggestion
                        key={index}
                        onChange={() => onSelectFilter?.(filter.value, fromHeader)}
                        option={filter}
                    />
                ))}
                {/* {filters.map((filter, index) => (
                    <div
                        className={`flexible-table__filter-menu__item ${
                            selectedFilters?.find((v) => filter.value === v.filter && v.fromHeader === fromHeader)
                                ? "flexible-table__filter-menu__item--selected"
                                : ""
                        }`}
                        key={uuid()}
                        onClick={() => onSelectFilter?.(filter.value, fromHeader)}
                    >
                        <span className="flexible-table__filter-menu__text">{filter.valueToDisplay}</span>
                        {selectedFilters?.find((v) => filter.value === v.filter && v.fromHeader === fromHeader) && (
                            <Icon name="check" color="var(--purple-drawer-primario)" />
                        )}
                    </div>
                ))} */}
            </div>
        </div>
    )
}

export default FilterMenu
