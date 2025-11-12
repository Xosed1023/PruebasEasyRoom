import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const ArrowRightFull = ({ color = "var(--tipografa)", ...props }: IconProps) => {
    return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M4.16797 9.99984H15.8346M15.8346 9.99984L10.0013 4.1665M15.8346 9.99984L10.0013 15.8332"
                stroke={color}
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default ArrowRightFull
