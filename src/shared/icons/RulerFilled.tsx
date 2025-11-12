import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const RullerFilled = memo(({ color = "#0E0E0E", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    fill={color}
                    d="m3.285 8.805 1.414 1.414.943-.943-1.414-1.414 1.414-1.414 1.886 1.885.942-.942-1.884-1.886L7.999 4.09l1.414 1.414.943-.943-1.414-1.414 1.886-1.886a.667.667 0 0 1 .942 0l3.3 3.3a.667.667 0 0 1 0 .943l-9.9 9.9a.667.667 0 0 1-.942 0l-3.3-3.3a.667.667 0 0 1 0-.943l2.357-2.357Z"
                />
            </g>
        </svg>
    )
})

export default RullerFilled
