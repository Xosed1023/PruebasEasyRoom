import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function arrows(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={50} height={50} fill="none" {...props}>
            <g>
                <path
                    fill="#6941C6"
                    d="M33.333 33.334V25L43.75 35.417 33.333 45.834V37.5h-25v-4.166h25ZM16.667 4.167v8.331l25 .002v4.167h-25V25L6.25 14.584 16.667 4.167Z"
                />
            </g>
        </svg>
    )
}

export default arrows
