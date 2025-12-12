import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function save3Fill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M3.333 2.5H15l2.256 2.256a.833.833 0 01.244.589v11.322a.833.833 0 01-.833.833H3.333a.833.833 0 01-.833-.833V3.333a.833.833 0 01.833-.833zm2.5.833V7.5h7.5V3.333h-7.5zM5 10v5.833h10V10H5zm5.833-5.833H12.5v2.5h-1.667v-2.5z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default save3Fill
