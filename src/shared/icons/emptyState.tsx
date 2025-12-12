import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function emptyState(props: IconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={160}
            height={160}
            fill="none"
            {...props}
        >
            <circle cx={80} cy={80} r={80} fill="#EFE9FF" />
            <g>
                <path
                    fill="#6941C6"
                    d="M109.999 83.333v23.334a3.333 3.333 0 0 1-3.333 3.333H53.333a3.333 3.333 0 0 1-3.334-3.333V83.333h-3.333v-6.666L49.999 60h60l3.334 16.667v6.666h-3.334Zm-53.333 0v20h46.667v-20H56.666Zm3.333 3.334h26.667v10H59.999v-10ZM50 50h60v6.667h-60V50Z"
                />
            </g>
            <defs>
                <clipPath id="a">
                    <path fill="#fff" d="M40 40h80v80H40z" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default emptyState
