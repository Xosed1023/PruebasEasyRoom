import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function bookRemix(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M20 22H6.5A3.5 3.5 0 013 18.5V5a3 3 0 013-3h14a1 1 0 011 1v18a1 1 0 01-1 1zm-1-2v-3H6.5a1.5 1.5 0 100 3H19zM10 4v8l3.5-2 3.5 2V4h-7z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default bookRemix
