import * as React from "react"
const transferFile = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={17} fill="none" {...props}>
        <g>
            <path
                fill="#0E0E0E"
                d="M10.667 1.958 14 5.293v9.338a.662.662 0 0 1-.662.662H2.662A.666.666 0 0 1 2 14.63V2.62c0-.365.297-.662.662-.662h8.005ZM8 7.958H5.333v1.334H8v2l2.667-2.667L8 5.958v2Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 .625h16v16H0z" />
            </clipPath>
        </defs>
    </svg>
)
export default transferFile
