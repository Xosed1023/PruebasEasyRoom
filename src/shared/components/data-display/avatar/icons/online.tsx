import * as React from "react"
import { IconProps } from "src/shared/icons/interfaces/IconProps.interface"

function OnlineIcon(props: IconProps) {
    return (
        <svg width="1em" height="1em" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <circle cx={6} cy={6} r={6} fill="#408232" />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.515 4.121L5.273 8.364 2.727 5.818l.848-.848 1.698 1.697 3.393-3.394.849.848z"
                fill="#fff"
            />
        </svg>
    )
}

export default OnlineIcon
