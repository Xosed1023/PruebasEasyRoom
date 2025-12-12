import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function calendar01(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M19 9H1m13-8v4M6 1v4m-.2 16h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 001.311-1.311C19 18.72 19 17.88 19 16.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 00-1.311-1.311C16.72 3 15.88 3 14.2 3H5.8c-1.68 0-2.52 0-3.162.327a3 3 0 00-1.311 1.311C1 5.28 1 6.12 1 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 001.311 1.311C3.28 21 4.12 21 5.8 21z"
                stroke={props.color || "#000"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default calendar01
