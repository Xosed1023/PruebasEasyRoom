import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const MenuDots = memo((props: IconProps) => {
    const { color = "#FFF", ...rest } = props
    return (
        <svg width={6} height={28} viewBox="0 0 6 28" fill="none" {...rest}>
            <path
                d="M0 3.5C0 1.84315 1.34315 0.5 3 0.5C4.65685 0.5 6 1.84315 6 3.5C6 5.15685 4.65685 6.5 3 6.5C1.34315 6.5 0 5.15685 0 3.5Z"
                fill={color}
            />
            <path
                d="M0 14C0 12.3431 1.34315 11 3 11C4.65685 11 6 12.3431 6 14C6 15.6569 4.65685 17 3 17C1.34315 17 0 15.6569 0 14Z"
                fill={color}
            />
            <path
                d="M3 21.5C1.34315 21.5 0 22.8431 0 24.5C0 26.1569 1.34315 27.5 3 27.5C4.65685 27.5 6 26.1569 6 24.5C6 22.8431 4.65685 21.5 3 21.5Z"
                fill={color}
            />
        </svg>
    )
})

export default MenuDots
