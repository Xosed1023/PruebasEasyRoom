import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ChevronFill = memo(({ color, ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 11 19" {...rest}>
            <path fill={color} d="M3.666 9.5 11 16.7l-1.833 1.8L0 9.5l9.167-9L11 2.3 3.666 9.5Z" />
        </svg>
    )
})

export default ChevronFill
