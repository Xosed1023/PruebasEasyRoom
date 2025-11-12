import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function infoToolTip(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} fill="none" {...props}>
            <g>
                <path
                    fill="#6941C6"
                    d="M9 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm-.75-8.25v4.5h1.5v-4.5h-1.5Zm0-3v1.5h1.5v-1.5h-1.5Z"
                />
            </g>
        </svg>
    )
}

export default infoToolTip
