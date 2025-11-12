import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function swapBox(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} fill="none" {...props}>
            <g clipPath="url(#a)">
                <path
                    fill="#6941C6"
                    d="M3.75 3.75h22.5A1.25 1.25 0 0 1 27.5 5v20a1.25 1.25 0 0 1-1.25 1.25H3.75A1.25 1.25 0 0 1 2.5 25V5a1.25 1.25 0 0 1 1.25-1.25Zm15 5v2.5h-5v2.5h5v2.5l4.375-3.75-4.375-3.75Zm-7.5 12.5v-2.5h5v-2.5h-5v-2.5L6.875 17.5l4.375 3.75Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h30v30H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default swapBox
