import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function dashboardFill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M2.5 10.833h6.667V2.5H2.5v8.333zm0 6.667h6.667v-5H2.5v5zm8.333 0H17.5V9.167h-6.667V17.5zm0-15v5H17.5v-5h-6.667z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default dashboardFill
