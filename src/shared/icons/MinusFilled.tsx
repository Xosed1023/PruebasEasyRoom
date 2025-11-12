import * as React from "react"
import { IconProps } from "./interfaces/IconProps.interface"
const SvgComponent = ({ color, ...props }: IconProps) => (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_1417_78660)">
            <path
                d="M15 27.5C8.09625 27.5 2.5 21.9037 2.5 15C2.5 8.09625 8.09625 2.5 15 2.5C21.9037 2.5 27.5 8.09625 27.5 15C27.5 21.9037 21.9037 27.5 15 27.5ZM8.75 13.75V16.25H21.25V13.75H8.75Z"
                fill={color || "#000"}
            />
        </g>
        <defs>
            <clipPath id="clip0_1417_78660">
                <rect width="30" height="30" fill="white" />
            </clipPath>
        </defs>
    </svg>
)
export default SvgComponent
