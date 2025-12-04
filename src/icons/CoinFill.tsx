import { memo } from "react"
import { IconProps } from "./Icon.type"

const CoinFill = memo((props: IconProps) => {
    const { color = "#BEBEBE", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 25" fill="none" {...rest}>
            <path
                fill={color}
                d="M12 23.047c-6.075 0-11-4.925-11-11s4.925-11 11-11 11 4.925 11 11-4.925 11-11 11Zm0-2.2a8.8 8.8 0 1 0 0-17.6 8.8 8.8 0 0 0 0 17.6Zm-3.85-6.6h6.05a.55.55 0 0 0 0-1.1H9.8a2.75 2.75 0 0 1 0-5.5h1.1v-2.2h2.2v2.2h2.75v2.2H9.8a.55.55 0 1 0 0 1.1h4.4a2.75 2.75 0 1 1 0 5.5h-1.1v2.2h-2.2v-2.2H8.15v-2.2Z"
            />
        </svg>
    )
})

export default CoinFill
