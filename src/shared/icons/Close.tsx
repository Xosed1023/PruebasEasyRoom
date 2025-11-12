import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Close = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width={25} height={25} viewBox="0 0 25 25" fill="none" {...rest}>
            <path
                d="M18.1731 6.05769L6.05769 18.1731M6.05769 6.05769L18.1731 18.1731"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
})

export default Close
