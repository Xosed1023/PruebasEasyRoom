import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function sort(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M8 5.333H5.334v8H4v-8H1.333L4.667 2 8 5.333zm6.667 5.334L11.333 14 8 10.667h2.667v-8H12v8h2.667z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default sort
