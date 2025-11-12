import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Phone = memo((props: IconProps) => {
    const { color = "#000", ...rest } = props
    return (
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <path
                d="M10.7567 20.9056L8.29302 23.1033L3.89746 23.1033V18.4408L14.7765 7.56175L19.4379 12.2254L10.7567 20.9056ZM16.3292 6.00902L18.661 3.67718C18.8671 3.47117 19.1466 3.35544 19.4379 3.35544C19.7293 3.35544 20.0088 3.47117 20.2149 3.67718L23.3236 6.78593C23.5296 6.99201 23.6454 7.27146 23.6454 7.56285C23.6454 7.85423 23.5296 8.13369 23.3236 8.33976L20.9918 10.6705L16.3303 6.00902H16.3292Z"
                fill={color || "#000"}
            />
        </svg>
    )
})

export default Phone
