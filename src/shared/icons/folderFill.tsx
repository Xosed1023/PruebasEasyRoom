import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const FolderFill = (props: IconProps) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
            <g clipPath="url(#a)">
                <path
                    fill="#fff"
                    d="M8.279 3.333h5.724a.667.667 0 0 1 .666.667v9.333a.667.667 0 0 1-.666.667h-12a.666.666 0 0 1-.667-.667V2.667A.667.667 0 0 1 2.003 2h4.942L8.28 3.333Z"
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

export default FolderFill
