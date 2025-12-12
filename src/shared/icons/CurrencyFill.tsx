import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CurrencyFill = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 20" fill="none" {...rest}>
            <path
                d="M14 14h2V2H6v2h8v10zm0 2v3c0 .552-.45 1-1.007 1H1.007A1 1 0 010 19L.003 5c0-.552.45-1 1.007-1H4V1a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1h-3zM4 14v2h2v1h2v-1h.5a2.5 2.5 0 000-5h-3a.5.5 0 010-1H10V8H8V7H6v1h-.5a2.5 2.5 0 100 5h3a.5.5 0 010 1H4z"
                fill={color}
            />
        </svg>
    )
})

export default CurrencyFill
