import { memo } from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Coffee = memo(({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...rest}>
            <g clipPath="url(#a)">
                <path
                    fill={color}
                    d="M3.334 2h10a1.333 1.333 0 0 1 1.333 1.333v2a1.334 1.334 0 0 1-1.333 1.334h-1.333v2a2.667 2.667 0 0 1-2.667 2.666h-4a2.667 2.667 0 0 1-2.667-2.666v-6A.667.667 0 0 1 3.334 2Zm8.667 1.333v2h1.333v-2h-1.333ZM1.334 12.667h12V14h-12v-1.333Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    )
})

export default Coffee
