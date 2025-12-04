import { memo } from "react"
import { IconProps } from "./Icon.type"

const Close = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                stroke={color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.667}
                d="M15 5 5 15M5 5l10 10"
            />
        </svg>
    )
})

export default Close
