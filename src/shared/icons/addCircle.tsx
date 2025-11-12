import React from 'react'
import { IconProps } from "./interfaces/IconProps.interface"

const AddCircle = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
        <g clipPath="url(#a)">
            <path
                fill={props.color || "#6941C6"}
                d="M7.999 14.665a6.667 6.667 0 1 1 0-13.333 6.667 6.667 0 0 1 0 13.333Zm-.667-7.333H4.665v1.333h2.667v2.667h1.333V8.665h2.667V7.332H8.665V4.665H7.332v2.667Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
)

export default AddCircle