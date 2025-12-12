import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function plusCircle(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M11 7v8m-4-4h8m6 0c0 5.523-4.477 10-10 10S1 16.523 1 11 5.477 1 11 1s10 4.477 10 10z"
                stroke={props.color || "#000"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default plusCircle
