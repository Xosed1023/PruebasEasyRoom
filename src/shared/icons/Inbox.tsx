import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const Inbox = ({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <g clipPath="url(#clip0_165_4243)">
                <path
                    d="M2.66659 2H13.3333L14.6666 4.66667V13.3333C14.6666 13.5101 14.5963 13.6797 14.4713 13.8047C14.3463 13.9298 14.1767 14 13.9999 14H1.99992C1.82311 14 1.65354 13.9298 1.52851 13.8047C1.40349 13.6797 1.33325 13.5101 1.33325 13.3333V4.66933L2.66659 2ZM8.66659 9.33333V6.66667H7.33325V9.33333H5.33325L7.99992 12L10.6666 9.33333H8.66659ZM13.1759 4.66667L12.5093 3.33333H3.49125L2.82459 4.66667H13.1759Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_165_4243">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default Inbox
