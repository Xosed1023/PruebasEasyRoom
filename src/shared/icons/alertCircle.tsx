import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ClockRefresh = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" {...rest}>
            <g clipPath="url(#prefix__clip0_576_18448)">
                <path
                    d="M8 5.333V8m0 2.667h.007M14.667 8A6.667 6.667 0 111.333 8a6.667 6.667 0 0113.334 0z"
                    stroke={color}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="prefix__clip0_576_18448">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default ClockRefresh
