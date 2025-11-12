import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const Origin = (props: IconProps) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
        <g clipPath="url(#a)">
            <path
                fill="#fff"
                d="M1.367 8.666H5.02a11.933 11.933 0 0 0 1.95 5.92 6.67 6.67 0 0 1-5.602-5.92Zm0-1.333a6.67 6.67 0 0 1 5.602-5.92 11.933 11.933 0 0 0-1.95 5.92H1.367Zm13.267 0h-3.652a11.933 11.933 0 0 0-1.95-5.92 6.67 6.67 0 0 1 5.602 5.92Zm0 1.333a6.67 6.67 0 0 1-5.601 5.92 11.933 11.933 0 0 0 1.95-5.92h3.651Zm-8.28 0h3.293c-.11 1.8-.676 3.542-1.646 5.062a10.606 10.606 0 0 1-1.647-5.062Zm0-1.333c.11-1.8.676-3.542 1.647-5.061a10.605 10.605 0 0 1 1.646 5.061H6.354Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
)
export default Origin
