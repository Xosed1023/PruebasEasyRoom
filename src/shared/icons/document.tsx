import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Document = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
            <g clipPath="url(#a)">
                <path
                    fill="#fff"
                    d="M11.333 1.333h2A.667.667 0 0 1 14 2v12a.666.666 0 0 1-.667.667H2.667A.667.667 0 0 1 2 14V2a.667.667 0 0 1 .667-.667h2V0H6v1.333h4V0h1.333v1.333Zm-6.666 4v1.334h6.666V5.333H4.667Zm0 2.667v1.333h6.666V8H4.667Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M0 0h16v16H0z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default Document
