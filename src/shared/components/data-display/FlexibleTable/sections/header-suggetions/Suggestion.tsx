import "./HeaderSuggetions.css"
import cx from "classnames"
import { Option, SuggetionsProps } from "./Suggestions.type"
import { useContext, useState } from "react"
import { FiltersContext } from "../../context/table.context"
import CheckBox from "./components/CheckBox/CheckBox"

const Suggestion = ({ option, onChange }: { option: Option; onChange: SuggetionsProps["onChange"] }) => {
    const { selectedFilters } = useContext(FiltersContext)

    const isActive = !!selectedFilters?.find((f) => f.filter === option.value)

    const [isHovered, setisHovered] = useState(false)

    return (
        <div
            className={cx({
                "header-suggetions__item": true,
                "header-suggetions__item--active": isActive,
            })}
            onClick={(e) => {
                e.stopPropagation()
                onChange(option.value, option.valueToDisplay || option.value)
            }}
            onMouseEnter={() => setisHovered(true)}
            onMouseLeave={() => setisHovered(false)}
        >
            <span className="header-suggetions__item-label">
                <CheckBox checked={isActive} isHovered={isHovered} />
                <span className="header-suggetions__item-label__text">{option.valueToDisplay || option.value}</span>
            </span>
        </div>
    )
}

export default Suggestion
