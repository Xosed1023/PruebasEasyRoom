import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const SpamFill = memo((props: IconProps) => {
    const { color = "#fff" } = props
    return (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
            <path
                d="M17.5 2.5L23 12L17.5 21.5H6.5L1 12L6.5 2.5H17.5ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"
                fill={color}
            />
        </svg>
    )
})
export default SpamFill
