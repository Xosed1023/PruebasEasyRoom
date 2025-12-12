import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function arrowLeft(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path d="M3.666 9L11 16.2 9.167 18 0 9l9.167-9L11 1.8 3.666 9z" fill={props.color || "#000"} />
        </svg>
    )
}

export default arrowLeft
