import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function accountBoxFill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M.5 2.828A2.327 2.327 0 012.828.5h16.345A2.327 2.327 0 0121.5 2.828v16.345a2.327 2.327 0 01-2.328 2.327H2.828A2.327 2.327 0 01.5 19.172V2.828zM4.417 18h13.405a8.158 8.158 0 00-6.703-3.5A8.157 8.157 0 004.417 18zM11 12.167A4.083 4.083 0 1011 4a4.083 4.083 0 000 8.167z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default accountBoxFill
