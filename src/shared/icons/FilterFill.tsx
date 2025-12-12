import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const FilterFill = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 14 14" fill="none" {...rest}>
            <path fill={color} d="m5.833 8.167-3.5-5.25V1.75h9.334v1.167l-3.5 5.25v3.5l-2.334 1.166V8.167Z" />
        </svg>
    )
})

export default FilterFill
