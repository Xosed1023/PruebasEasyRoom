import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CurrencySymbol = memo(({ color = "#2D3648", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 10 17" fill="none" {...rest}>
            <path
                fill={color}
                fillRule="evenodd"
                d="M5.666 1.167a.667.667 0 0 0-1.333 0v2h-1a3 3 0 1 0 0 6h1V12.5H1a.667.667 0 0 0 0 1.333h3.333v2a.667.667 0 1 0 1.333 0v-2h1a3 3 0 1 0 0-6h-1V4.5h2.667a.667.667 0 0 0 0-1.333H5.666v-2ZM4.333 4.5h-1a1.667 1.667 0 0 0 0 3.333h1V4.5Zm1.333 4.667V12.5h1a1.667 1.667 0 1 0 0-3.333h-1Z"
                clipRule="evenodd"
            />
        </svg>
    )
})

export default CurrencySymbol
