import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const BusinessStar = memo((props: IconProps) => {
    const { color = "#0E0E0E", ...rest } = props
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <path
                fill={color}
                d="M10.33 8 6.94 9.41l-.294 3.662-2.389-2.79-3.573.853L2.597 8 .683 4.866l3.573.852 2.39-2.79.293 3.662L10.33 8Zm4.334-2.666h-6V4h6v1.334Zm0 6.666h-6v-1.333h6V12Zm0-3.333h-3.333V7.334h3.333v1.333Z"
            />
        </svg>
    )
})

export default BusinessStar
