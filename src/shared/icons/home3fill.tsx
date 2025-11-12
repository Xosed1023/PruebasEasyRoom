import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function home3fill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M13.333 13.333a.667.667 0 01-.666.667H3.333a.666.666 0 01-.666-.667v-6h-2L7.55 1.075a.667.667 0 01.898 0l6.884 6.258h-2v6zm-8-3.333v1.333h5.334V10H5.333z"
                fill={props.color || "#fff"}
            />
        </svg>
    )
}

export default home3fill
