import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Check = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 12 9" fill="none" {...rest}>
            <path
                d="M10.667 1.5L4.251 7.917 1.334 5"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default Check
