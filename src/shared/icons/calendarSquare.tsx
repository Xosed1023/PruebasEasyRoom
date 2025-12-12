import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function calendarSquare(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M1.667 9.167h16.666v7.5a.834.834 0 01-.833.833h-15a.833.833 0 01-.833-.833v-7.5zm12.5-6.667H17.5a.833.833 0 01.833.833V7.5H1.667V3.333A.833.833 0 012.5 2.5h3.333V.833H7.5V2.5h5V.833h1.667V2.5z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default calendarSquare
