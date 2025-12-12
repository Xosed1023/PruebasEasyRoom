import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function OutInbox(props: IconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={31} fill="none" {...props}>
            <g>
                <path
                    fill="#6941C6"
                    d="m25 4.25 2.5 5V25.5a1.25 1.25 0 0 1-1.25 1.25H3.75A1.25 1.25 0 0 1 2.5 25.5V9.255L5 4.25h20ZM15 13l-5 5h3.75v5h2.5v-5H20l-5-5Zm8.455-6.25H6.545l-1.249 2.5h19.409l-1.25-2.5Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 .5h30v30H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default OutInbox
