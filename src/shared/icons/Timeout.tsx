import * as React from "react"
const Timeout = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={15} height={15} fill="none" {...props}>
        <circle cx={7.5} cy={7.5} r={7.5} fill="#fff" />
        <path
            fill={props.color || "#000"}
            d="M5.191 4.984A4.481 4.481 0 0 1 8 4a4.48 4.48 0 0 1 2.809.984l.727-.726.707.707-.727.726a4.5 4.5 0 1 1-7.032 0l-.727-.726.708-.707.726.726ZM8.5 8V5.747L6 9h1.5v2.25L10 8H8.5ZM6 2.5h4v1H6v-1Z"
        />
    </svg>
)
export default Timeout
