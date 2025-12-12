import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ChevronUp = ({ color, ...props }: IconProps) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M10.5906 13.0899C10.2651 13.4153 9.73748 13.4153 9.41205 13.0899L4.41205 8.08991C4.08661 7.76447 4.08661 7.23683 4.41205 6.9114C4.73748 6.58596 5.26512 6.58596 5.59056 6.9114L10.0013 11.3221L14.412 6.9114C14.7375 6.58596 15.2651 6.58596 15.5906 6.9114C15.916 7.23683 15.916 7.76447 15.5906 8.08991L10.5906 13.0899Z"
                fill={color || "#000"}
            />
        </svg>
    )
}

export default ChevronUp
