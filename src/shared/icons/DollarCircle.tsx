import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const DollarCircle = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm-3.5-8v2H9v2h2v-2h1a2.5 2.5 0 000-5H8a.5.5 0 110-1h5.5V6H11V4H9v2H8a2.5 2.5 0 100 5h4a.5.5 0 010 1H6.5z"
                fill={color}
            />
        </svg>
    )
})

export default DollarCircle
