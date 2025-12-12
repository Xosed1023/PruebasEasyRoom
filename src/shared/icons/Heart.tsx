import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Heart = memo((props: IconProps) => {
    const { color = "var(--header)", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 16" fill="none" {...rest}>
            <path fill={color} d="M9 1.774a4.998 4.998 0 0 1 7.065 7.053L9 15.904 1.934 8.827A5 5 0 0 1 9 1.774Z" />
        </svg>
    )
})

export default Heart
