import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const FolderOpenFilled = ({ color = "#000", ...rest }: IconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
            <g clipPath="url(#clip0_165_4207)">
                <path
                    d="M1.99992 14C1.82311 14 1.65354 13.9298 1.52851 13.8047C1.40349 13.6797 1.33325 13.5101 1.33325 13.3333V2.66667C1.33325 2.48986 1.40349 2.32029 1.52851 2.19526C1.65354 2.07024 1.82311 2 1.99992 2H6.94258L8.27592 3.33333H13.3333C13.5101 3.33333 13.6796 3.40357 13.8047 3.5286C13.9297 3.65362 13.9999 3.82319 13.9999 4V6H2.66659V12.664L3.99992 7.33333H14.9999L13.4599 13.4953C13.4238 13.6395 13.3406 13.7675 13.2234 13.8589C13.1062 13.9503 12.9619 14 12.8133 14H1.99992Z"
                    fill={color}
                />
            </g>
            <defs>
                <clipPath id="clip0_165_4207">
                    <rect width="16" height="16" fill={color} />
                </clipPath>
            </defs>
        </svg>
    )
}

export default FolderOpenFilled
