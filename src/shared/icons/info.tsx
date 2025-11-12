import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function info(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={21}
            fill="none"
            {...props}
        >
            <g clipPath="url(#a)">
                <path
                    fill="#6941C6"
                    d="M10 18.835a8.333 8.333 0 1 1 0-16.667 8.333 8.333 0 1 1 0 16.667Zm-.834-9.167v5h1.667v-5H9.166Zm0-3.333V8h1.667V6.335H9.166Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 .5h20v20H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default info
