import * as React from "react"
const ControlInputs = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} fill="none" {...props}>
        <circle cx={30} cy={30} r={30} fill="#EFE9FF" />
        <g clipPath="url(#a)">
            <path
                fill="#6941C6"
                d="M36.333 37.833V32l7.292 7.292-7.292 7.291V40.75h-17.5v-2.917h17.5ZM24.667 17.417v5.832l17.5.001v2.917h-17.5V32l-7.292-7.292 7.292-7.291Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M13 14.5h35v35H13z" />
            </clipPath>
        </defs>
    </svg>
)
export default ControlInputs
