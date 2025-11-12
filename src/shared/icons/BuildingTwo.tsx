import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BuildingTwo = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width={24} height={24} viewBox="0 0 24 22" fill="none" {...rest}>
            <path
                fill={color}
                d="M12 19h2V6l6.394 2.74a1 1 0 0 1 .606.92V19h2v2H1v-2h2V5.65a1 1 0 0 1 .594-.914l7.703-3.424A.5.5 0 0 1 12 1.77z"
            />
        </svg>
    )
})

export default BuildingTwo
