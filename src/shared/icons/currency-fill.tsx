import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

function currencyFill(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M17 16h2V4H9v2h8v10zm0 2v3c0 .552-.45 1-1.007 1H4.007A1 1 0 013 21l.003-14c0-.552.45-1 1.007-1H7V3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1 1h-3zM7 16v2h2v1h2v-1h.5a2.5 2.5 0 000-5h-3a.5.5 0 010-1H13v-2h-2V9H9v1h-.5a2.5 2.5 0 000 5h3a.5.5 0 010 1H7z"
                fill={props.color || "#000"}
            />
        </svg>
    )
}

export default currencyFill
