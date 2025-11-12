import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function coinMoney(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-3.5-8v2H11v2h2v-2h1a2.5 2.5 0 000-5h-4a.5.5 0 010-1h5.5V8H13V6h-2v2h-1a2.5 2.5 0 100 5h4a.5.5 0 010 1H8.5z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default coinMoney
