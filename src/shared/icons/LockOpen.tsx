import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const LockOpen = memo((props: IconProps) => {
    const { color = "#6941C6", secondarycolor = "#606060", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 72 84" fill="none" {...rest}>
            <path
                fill={color}
                fillRule="evenodd"
                d="M68 28H4a4 4 0 0 0-4 4v48a4 4 0 0 0 4 4h64a4 4 0 0 0 4-4V32a4 4 0 0 0-4-4ZM32 68v-9.072a8 8 0 1 1 8 0V68h-8Z"
                clipRule="evenodd"
            />
            <path fill={secondarycolor} d="M12 24v4h8v-4a16 16 0 1 1 32 0v4h8v-4a24 24 0 0 0-48 0Z" />
        </svg>
    )
})

export default LockOpen
