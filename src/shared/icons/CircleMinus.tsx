import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CircleMinus = memo(({ ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" fill="none" viewBox="0 0 14 14" {...rest}>
            <circle cx={7} cy={7} r={7} fill="#D4C1FF" />
            <path stroke="#6941C6" strokeWidth={2} d="M4 7.5h6" />
        </svg>
    )
})

export default CircleMinus
