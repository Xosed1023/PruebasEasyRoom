import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Star = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 17 16" fill="none" {...rest}>
            <path
                d="M10.631 5.625 8.406 0 6.181 5.625l-5.775.487 4.4 3.962L3.462 16l4.944-3.175L13.35 16l-1.343-5.926 4.4-3.962-5.776-.487Z"
                fill={color}
            />
        </svg>
    )
})

export default Star
