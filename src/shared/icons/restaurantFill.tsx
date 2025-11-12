import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function restaurantFill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M18 0v20h-2v-8h-3V5a5 5 0 015-5zM6 11.9V20H4v-8.1A5.002 5.002 0 010 7V1h2v7h2V1h2v7h2V1h2v6a5.002 5.002 0 01-4 4.9z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default restaurantFill
