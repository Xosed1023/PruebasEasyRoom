import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const OpenMailFill = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" {...rest}>
            <path
                d="M.243 5.854 9.49.31a1 1 0 0 1 1.029 0l9.238 5.545a.5.5 0 0 1 .243.429V19a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V6.283a.5.5 0 0 1 .243-.429Zm16.103 1.39-6.285 5.439-6.414-5.445-1.294 1.524 7.72 6.555 7.581-6.56-1.308-1.513Z"
                fill={color}
            />
        </svg>
    )
})

export default OpenMailFill
