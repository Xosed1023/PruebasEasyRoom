import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function book2Fill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M21 18H6a1 1 0 000 2h15v2H6a3 3 0 01-3-3V4a2 2 0 012-2h16v16zm-5-9V7H8v2h8z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default book2Fill
