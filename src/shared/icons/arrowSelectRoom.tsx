import * as React from "react"
import { IconNamesProps } from "./Icon"

function arrowSelectRoom(props: IconNamesProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M7.307 14.294a1 1 0 001.418 1.412l6.984-7.017a1 1 0 00-.003-1.414L8.689.291A1 1 0 007.28 1.71l5.305 5.28-11.586.027a1 1 0 10.004 2l11.586-.027-5.28 5.305z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default arrowSelectRoom
