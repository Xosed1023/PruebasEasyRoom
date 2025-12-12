import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const CreditCard = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <path
                d="M20 7v10a1 1 0 01-1 1H1a1 1 0 01-1-1V7h20zm0-2H0V1a1 1 0 011-1h18a1 1 0 011 1v4zm-7 8v2h4v-2h-4z"
                fill={color}
            />
        </svg>
    )
})

export default CreditCard
