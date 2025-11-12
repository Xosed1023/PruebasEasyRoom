import React from "react"
import { IconProps } from "./interfaces/IconProps.interface"

const HotelFilled = (props: IconProps) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_403_1908481)">
                <path
                    d="M11.3359 12.6667H12.6693V7.33333H8.66927V12.6667H10.0026V8.66667H11.3359V12.6667ZM2.0026 12.6667V2.66667C2.0026 2.48986 2.07284 2.32029 2.19787 2.19526C2.32289 2.07024 2.49246 2 2.66927 2H12.0026C12.1794 2 12.349 2.07024 12.474 2.19526C12.599 2.32029 12.6693 2.48986 12.6693 2.66667V6H14.0026V12.6667H14.6693V14H1.33594V12.6667H2.0026ZM4.66927 7.33333V8.66667H6.0026V7.33333H4.66927ZM4.66927 10V11.3333H6.0026V10H4.66927ZM4.66927 4.66667V6H6.0026V4.66667H4.66927Z"
                    fill={props.color || "#000"}
                />
            </g>
            <defs>
                <clipPath id="clip0_403_1908481">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default HotelFilled
