import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const PriceTagFilled = memo(({ color = "#0E0E0E", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    fill={color}
                    d="M2 4.667 7.63.913a.667.667 0 0 1 .74 0L14 4.667V14a.666.666 0 0 1-.667.667H2.667A.667.667 0 0 1 2 14V4.667Zm6 2.666a1.333 1.333 0 1 0 0-2.666 1.333 1.333 0 0 0 0 2.666Zm-2.667 3.334V12h5.334v-1.333H5.333Zm0-2V10h5.334V8.667H5.333Z"
                />
            </g>
        </svg>
    )
})

export default PriceTagFilled
